import React from "react";
import screenfull from "screenfull";
import { VideoEmbedWrapper } from "@/components/video-embed/video-embed.styles";
import { Stream } from "@/types";
import { asset } from "@/utils";
import config from "@/config";

type Props = {
  stream?: Stream;
};

export default function VideoEmbed({ stream }: Props) {
  const [interacted, setInteracted] = React.useState(false);

  const src = React.useMemo(() => {
    return `${config.apiUrl}/api/watch/${stream?.uuid}`;
  }, [stream]);

  const poster = React.useMemo(() => {
    if (!stream?.largeCoverImage) return "";
    return asset(stream.largeCoverImage);
  }, [stream]);

  const videoRef = React.useRef<HTMLVideoElement>();

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();

      // Toggle full screen video
      if (["f"].includes(key) && videoRef.current && screenfull.isEnabled) {
        screenfull.toggle(videoRef.current).catch((err) => {
          console.error(err);
        });
      }

      // Play/pause video
      if ([" ", "k"].includes(key)) {
        if (key === " ") {
          event.preventDefault();
        }
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play().catch((err) => {
              console.error(err);
            });
          } else {
            videoRef.current.pause();
          }
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function onTimeUpdate() {
      localStorage.setItem(stream.uuid, `${video.currentTime}`);
    }

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [interacted, stream.uuid]);

  React.useEffect(() => {
    if (!videoRef.current) return;
    if (!interacted) return;
    const currentTime = parseFloat(localStorage.getItem(stream.uuid));
    if (isNaN(currentTime)) return;
    videoRef.current.currentTime = currentTime;
  }, [interacted, stream.uuid]);

  return (
    <VideoEmbedWrapper
      onClick={() => {
        setInteracted(true);
      }}
      style={{
        cursor: interacted ? "auto" : "pointer",
        backgroundImage: interacted ? undefined : `url(${poster})`,
      }}
    >
      {!interacted && (
        <svg enableBackground="new 0 0 32 32" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M28.516,14L6,2.75C5.344,2.453,4.672,2,4,2C2.922,2,2,2.906,2,4v24c0,1.094,0.922,2,2,2c0.672,0,1.344-0.453,2-0.75  L28.516,18C29.063,17.734,30,17.188,30,16S29.063,14.266,28.516,14z M6,24.778V7.222L23.568,16L6,24.778z"
            fill="currentColor"
          />
        </svg>
      )}
      {interacted && <video ref={videoRef} src={src} controls autoPlay />}
    </VideoEmbedWrapper>
  );
}
