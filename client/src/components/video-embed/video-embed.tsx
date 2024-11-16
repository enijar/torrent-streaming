import React from "react";
import screenfull from "screenfull";
import { VideoEmbedWrapper } from "@/components/video-embed/video-embed.styles";
import { Stream } from "@/types";
import { asset } from "@/utils";
import config from "@/config";
import { appState } from "@/state/app-state";

type Props = {
  stream?: Stream;
};

export default function VideoEmbed({ stream }: Props) {
  const interacted = appState((state) => state.interacted);
  const interactedRef = React.useRef(interacted);

  const src = React.useMemo(() => {
    return `${config.apiUrl}/api/watch/${stream?.uuid}`;
  }, [stream]);

  const poster = React.useMemo(() => {
    if (!stream?.largeCoverImage) return "";
    return asset(stream.largeCoverImage);
  }, [stream]);

  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (video === null) return;

    function onKeyDown(event: KeyboardEvent) {
      const key = event.code;

      if (!["Space", "KeyF"].includes(key)) return;

      // Toggle full screen video
      if (["KeyF"].includes(key) && screenfull.isEnabled) {
        screenfull.exit().catch(console.error);
      }

      // Play/pause video
      if (key === "Space") {
        event.preventDefault();
      }
      if (video.paused) {
        video.play().catch(console.error);
      } else {
        video.pause();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  React.useEffect(() => {
    const video = videoRef.current;
    if (video === null) return;

    function onTimeUpdate() {
      localStorage.setItem(stream.uuid, `${video.currentTime}`);
    }

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [stream.uuid]);

  React.useEffect(() => {
    const video = videoRef.current;
    if (video === null) return;

    function hideCursor() {
      document.body.style.cursor = "none";
    }

    function showCursor() {
      document.body.style.cursor = "auto";
    }

    function onFullscreenChange() {
      if (screenfull.isFullscreen) {
        hideCursor();
      } else {
        showCursor();
      }
    }

    screenfull.on("change", onFullscreenChange);
    video.addEventListener("play", hideCursor);
    video.addEventListener("pause", showCursor);
    video.addEventListener("ended", showCursor);
    return () => {
      screenfull.off("change", onFullscreenChange);
      video.removeEventListener("play", hideCursor);
      video.removeEventListener("pause", showCursor);
      video.removeEventListener("ended", showCursor);
    };
  }, []);

  React.useEffect(() => {
    const video = videoRef.current;
    if (video === null) return;
    if (!interactedRef.current) return;
    const currentTime = parseFloat(localStorage.getItem(stream.uuid));
    if (isNaN(currentTime)) return;
    video.currentTime = currentTime;
  }, [stream.uuid]);

  React.useEffect(() => {
    const video = videoRef.current;
    if (video === null) return;
    if (!interactedRef.current) return;
    screenfull.request(video).catch(console.error);
  }, []);

  return (
    <VideoEmbedWrapper
      style={{
        backgroundImage: interacted ? undefined : `url(${poster})`,
      }}
    >
      <svg
        style={{ display: interacted ? "none" : undefined }}
        enableBackground="new 0 0 32 32"
        version="1.1"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M28.516,14L6,2.75C5.344,2.453,4.672,2,4,2C2.922,2,2,2.906,2,4v24c0,1.094,0.922,2,2,2c0.672,0,1.344-0.453,2-0.75  L28.516,18C29.063,17.734,30,17.188,30,16S29.063,14.266,28.516,14z M6,24.778V7.222L23.568,16L6,24.778z"
          fill="currentColor"
        />
      </svg>
      <video ref={videoRef} src={src} controls autoPlay style={{ display: interacted ? undefined : "none" }} />
    </VideoEmbedWrapper>
  );
}
