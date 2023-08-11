import React from "react";
import { WebTorrent as WebTorrentType } from "webtorrent";

const client = new ((window as any).WebTorrent as WebTorrentType)();

export default function Test() {
  const videoContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const videoContainer = videoContainerRef.current;
    if (videoContainer === null) return;

    const magnetURI = `https://webtorrent.io/torrents/sintel.torrent`;

    client.add(magnetURI, (torrent) => {
      const videos = torrent.files.filter((file) => file.name.endsWith(".mp4"));
      const largestVideo = videos.reduce((largestVideo, video) => {
        return video.length > largestVideo.length ? video : largestVideo;
      }, videos[0]);
      largestVideo.appendTo(videoContainer);
    });
  }, []);

  return <div ref={videoContainerRef} />;
}
