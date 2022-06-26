import React from "react";
import {
  VideoPlayPause,
  VideoControls,
  VideoPoster,
  VideoProgress,
  VideoWrapper,
} from "@/components/video/video.styles";
import { formatVideoTime } from "@/utils";

type Props = {
  src?: string;
  poster?: string;
};

export default function Video({ src, poster }: Props) {
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [showControls, setShowControls] = React.useState(true);
  const [interacted, setInteracted] = React.useState(false);

  const videoRef = React.useRef<HTMLVideoElement>();
  React.useEffect(() => {
    const video = videoRef.current;

    function onPlayState() {
      console.log(video.paused);
      setPlaying(!video.paused);
    }

    function updateState() {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
    }

    video.addEventListener("playing", onPlayState);
    video.addEventListener("pause", onPlayState);
    video.addEventListener("loadedmetadata", updateState);
    video.addEventListener("timeupdate", updateState);
    video.addEventListener("durationchange", updateState);
    return () => {
      video.removeEventListener("playing", onPlayState);
      video.removeEventListener("pause", onPlayState);
      video.removeEventListener("loadedmetadata", updateState);
      video.removeEventListener("timeupdate", updateState);
      video.removeEventListener("durationchange", updateState);
    };
  }, []);

  const progressRef = React.useRef<HTMLInputElement>();
  React.useEffect(() => {
    const progress = currentTime / duration;
    if (isNaN(progress)) return;
    progressRef.current.style.setProperty("--progress", String(progress));
  }, [currentTime, duration]);

  const showControlsTimeoutRef = React.useRef<NodeJS.Timeout>();
  React.useEffect(() => {
    return () => clearTimeout(showControlsTimeoutRef.current);
  }, []);

  const showControlsForTime = React.useCallback(
    (ms = 3000) => {
      if (!interacted) return;
      if (!playing) return setShowControls(true);
      setShowControls(true);
      clearTimeout(showControlsTimeoutRef.current);
      showControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, ms);
    },
    [interacted, playing]
  );

  const onPointerDown = React.useCallback(() => {
    showControlsForTime();
  }, []);

  const onPointerMove = React.useCallback(() => {
    showControlsForTime();
  }, []);

  const onClick = React.useCallback(() => {
    setInteracted(true);
    showControlsForTime();
    if (videoRef.current.paused) {
      videoRef.current.play().catch((err) => {
        console.error(err);
      });
    } else {
      videoRef.current.pause();
    }
  }, [interacted]);

  return (
    <VideoWrapper
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onClick={onClick}
    >
      <video
        ref={videoRef}
        src={src}
        playsInline
        onContextMenu={(event) => event.preventDefault()}
      />
      {!interacted && (
        <VideoPoster style={{ backgroundImage: `url(${poster})` }} />
      )}
      <VideoPlayPause show={showControls}>
        {!playing && (
          <svg height="512px" viewBox="0 0 512 512" width="512px">
            <path d="M405.2,232.9L126.8,67.2c-3.4-2-6.9-3.2-10.9-3.2c-10.9,0-19.8,9-19.8,20H96v344h0.1c0,11,8.9,20,19.8,20  c4.1,0,7.5-1.4,11.2-3.4l278.1-165.5c6.6-5.5,10.8-13.8,10.8-23.1C416,246.7,411.8,238.5,405.2,232.9z" />
          </svg>
        )}
        {playing && (
          <svg height="512px" viewBox="0 0 512 512" width="512px">
            <path d="M224,435.8V76.1c0-6.7-5.4-12.1-12.2-12.1h-71.6c-6.8,0-12.2,5.4-12.2,12.1v359.7c0,6.7,5.4,12.2,12.2,12.2h71.6   C218.6,448,224,442.6,224,435.8z" />
            <path d="M371.8,64h-71.6c-6.7,0-12.2,5.4-12.2,12.1v359.7c0,6.7,5.4,12.2,12.2,12.2h71.6c6.7,0,12.2-5.4,12.2-12.2V76.1   C384,69.4,378.6,64,371.8,64z" />
          </svg>
        )}
      </VideoPlayPause>
      <VideoControls show={showControls}>
        <time>{formatVideoTime(currentTime)}</time>
        <VideoProgress ref={progressRef}>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(event) => {
              setCurrentTime(parseFloat(event.currentTarget.value));
            }}
          />
        </VideoProgress>
        <time>{formatVideoTime(duration - currentTime)}</time>
      </VideoControls>
    </VideoWrapper>
  );
}
