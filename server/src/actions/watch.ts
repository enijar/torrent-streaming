import fs from "node:fs";
import path from "node:path";
import type { Context } from "hono";
import { stream } from "hono/streaming";
import WebTorrent from "webtorrent";
import Stream from "~/entities/stream.js";
import streamToFile from "~/services/stream-to-file.js";
import config from "~/config.js";

const CHUNK_SIZE = 10 ** 6; // 1MB

const client = new WebTorrent();

function srtToWebVtt(srt: string): string {
  const normalized = srt
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
  const rawCues = normalized.split(/\n{2,}/);
  type Cue = {
    startEnd: string;
    text: string;
  };
  const cues: Cue[] = [];
  for (const rawCue of rawCues) {
    const lines = rawCue.split("\n").map((l) => l.trim());
    if (!lines.length) continue;
    let idx = 0;
    if (/^\d+$/.test(lines[0])) {
      idx = 1;
    }
    const tsIndex = lines.findIndex((line, i) => (i >= idx ? line.includes("-->") : false));
    if (tsIndex === -1) {
      continue;
    }
    const timeLine = lines[tsIndex];
    const textLines = lines.slice(tsIndex + 1);
    const text = textLines.join("\n").trim();
    if (!text) continue;
    const textLower = text.toLowerCase();
    const isSpam =
      textLower.includes("yts.mx") ||
      textLower.includes("yts.ag") ||
      textLower.includes("yify") ||
      textLower.startsWith("downloaded from");
    if (isSpam) continue;
    const vttTimeLine = timeLine.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
    cues.push({ startEnd: vttTimeLine, text });
  }
  const body = cues.map((cue, i) => `${i + 1}\n${cue.startEnd}\n${cue.text}`).join("\n\n");
  return `WEBVTT\n\n${body}\n`;
}

export default async function watch(ctx: Context) {
  try {
    const subtitles = ctx.req.query("subtitles") !== undefined;

    if (ctx.req.method === "HEAD") {
      ctx.status(200);
      return ctx.body(null);
    }

    const uuid = ctx.req.param("uuid") ?? "";
    const streamRecord = await Stream.findByPk(uuid);
    if (!streamRecord) {
      ctx.status(404);
      return ctx.text("404");
    }

    const files = await streamToFile(client, streamRecord);
    const file = subtitles ? files[1] : files[0];
    if (file === null) {
      ctx.status(404);
      return ctx.text("Not found");
    }
    if (subtitles) {
      const filePath = path.join(config.paths.torrents, file.path);
      if (!fs.existsSync(filePath)) {
        return ctx.status(404);
      }
      const fileStream = srtToWebVtt(await fs.promises.readFile(filePath, "utf-8"));
      return ctx.text(fileStream);
    }
    const range = ctx.req.header("range");
    if (range === undefined) {
      ctx.status(400);
      return ctx.text("Missing range header");
    }
    const [start, end] = range
      .replace(/bytes=/, "")
      .split("-")
      .map(Number);
    const rangeStart = start || 0;
    const rangeEnd =
      end && !isNaN(end) ? Math.min(end, file.length - 1) : Math.min(rangeStart + CHUNK_SIZE, file.length - 1);
    const contentLength = rangeEnd - rangeStart + 1;
    ctx.status(206);
    ctx.header("Content-Range", `bytes ${rangeStart}-${rangeEnd}/${file.length}`);
    ctx.header("Accept-Ranges", "bytes");
    ctx.header("Content-Length", contentLength.toString());
    ctx.header("Content-Type", "video/mp4");
    return stream(ctx, async (streamController) => {
      const fileStream = file.createReadStream({
        start: rangeStart,
        end: rangeEnd,
      });
      for await (const chunk of fileStream) {
        await streamController.write(chunk);
      }
      await streamController.close();
    });
  } catch (err) {
    console.error(err);
    ctx.status(500);
    return ctx.text("Server Error");
  }
}
