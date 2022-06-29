import React from "react";
import screenfull from "screenfull";
import {
  VideoEmbedCast,
  VideoEmbedCastControls,
  VideoEmbedCastControlsPlayPause,
  VideoEmbedCastControlsTime,
  VideoEmbedWrapper,
} from "@/components/video-embed/video-embed.styles";
import { useChromecast } from "@/hooks/use-chromecast";
import { Stream } from "@/types";
import { asset, formatTime } from "@/utils";
import config from "@/config";
import Loading from "@/components/loading/loading";

type Props = {
  stream?: Stream;
};

export default function VideoEmbed({ stream }: Props) {
  const [interacted, setInteracted] = React.useState(false);

  const cast = useChromecast();

  const src = React.useMemo(() => {
    // @note for local development testing, Chromecast requires a publicly hosted file
    if (config.env === "development" && cast.connected) {
      return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4";
    }
    return `${config.apiUrl}/api/watch/${stream?.uuid}`;
  }, [cast.connected, stream]);

  const poster = React.useMemo(() => {
    if (!stream?.largeCoverImage) return "";
    return asset(stream.largeCoverImage);
  }, [stream]);

  React.useEffect(() => {
    if (!cast.connected) return;
    console.log({ src, poster });
    cast.load({
      src,
      metadata: {
        title: stream.title,
        images: [{ url: poster }],
      },
    });
  }, [src, poster, stream, cast.connected]);

  React.useEffect(() => {
    return () => {
      if (cast.connected) {
        cast.stop();
      }
    };
  }, [cast.connected, cast.stop]);

  const videoRef = React.useRef<HTMLVideoElement>();

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();

      // Toggle full screen video
      if (
        ["f"].includes(key) &&
        videoRef.current &&
        screenfull.isEnabled &&
        !cast.connected
      ) {
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
        if (cast.connected) {
          if (cast.playerState === "PLAYING") {
            cast.pause();
          }
          if (cast.playerState === "PAUSED") {
            cast.play();
          }
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [cast.connected, cast.play, cast.pause, cast.playerState]);

  const [duration, setDuration] = React.useState("00:00:00");
  const [time, setTime] = React.useState("00:00:00");

  React.useEffect(() => {
    {
      const time = formatTime(cast.mediaInfo?.duration ?? 0);
      const hours = String(time.hours).padStart(2, "0");
      const minutes = String(time.minutes).padStart(2, "0");
      const seconds = String(time.seconds).padStart(2, "0");
      setDuration([hours, minutes, seconds].join(":"));
    }
    {
      const time = formatTime(cast.currentTime);
      const hours = String(time.hours).padStart(2, "0");
      const minutes = String(time.minutes).padStart(2, "0");
      const seconds = String(time.seconds).padStart(2, "0");
      setTime([hours, minutes, seconds].join(":"));
    }
  }, [cast.currentTime, cast.mediaInfo]);

  const [currentTime, setCurrentTime] = React.useState(0);

  React.useEffect(() => {
    cast.seek(currentTime);
  }, [cast.seek, currentTime]);

  const onSeekChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentTime(parseFloat(event.currentTarget.value));
    },
    []
  );

  const inputTimeRef = React.useRef<HTMLInputElement>();

  const play = React.useCallback(() => {
    cast.play();
    inputTimeRef.current.value = String(cast.currentTime);
  }, [cast.play]);

  const pause = React.useCallback(() => {
    cast.pause();
    inputTimeRef.current.value = String(cast.currentTime);
  }, [cast.pause]);

  return (
    <>
      <VideoEmbedWrapper
        onClick={() => {
          if (cast.connected) return;
          setInteracted(true);
        }}
        style={{
          cursor: cast.connected || interacted ? "auto" : "pointer",
          backgroundImage:
            !cast.connected && interacted ? undefined : `url(${poster})`,
        }}
      >
        {!cast.connected && (
          <>
            {!interacted && (
              <svg
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
            )}
            {interacted && <video ref={videoRef} src={src} controls autoPlay />}
          </>
        )}
        {cast.connected && (
          <VideoEmbedCastControls>
            {["BUFFERING"].includes(cast.playerState) && <Loading />}
            {["PAUSED", "PLAYING"].includes(cast.playerState) && (
              <VideoEmbedCastControlsPlayPause>
                {cast.playerState === "PAUSED" && (
                  <button onClick={play}>Play</button>
                )}
                {cast.playerState === "PLAYING" && (
                  <button onClick={pause}>Pause</button>
                )}
              </VideoEmbedCastControlsPlayPause>
            )}
            <VideoEmbedCastControlsTime>
              <time>{time}</time>
              <input
                ref={inputTimeRef}
                type="range"
                min={0}
                max={cast.mediaInfo?.duration ?? 0}
                value={currentTime}
                onChange={onSeekChange}
              />
              <time>{duration}</time>
            </VideoEmbedCastControlsTime>
          </VideoEmbedCastControls>
        )}
      </VideoEmbedWrapper>
      <VideoEmbedCast>{cast.button}</VideoEmbedCast>
    </>
  );
}
