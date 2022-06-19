import React from "react";
import {
  VideoEmbedCast,
  VideoEmbedCastControls,
  VideoEmbedWrapper,
} from "@/components/video-embed/video-embed.styles";
import useCast from "@/hooks/use-cast";
import { Stream } from "@/types";
import { asset } from "@/utils";
import config from "@/config";

type Props = {
  stream?: Stream;
};

export default function VideoEmbed({ stream }: Props) {
  const [interacted, setInteracted] = React.useState(false);

  const src = React.useMemo(() => {
    if (config.env === "development") {
      return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4";
    }
    return `${config.apiUrl}/api/watch/${stream?.uuid}`;
  }, [stream]);

  const poster = React.useMemo(() => {
    if (!stream?.largeCoverImage) return "";
    return asset(stream.largeCoverImage);
  }, [stream]);

  const cast = useCast(stream, { src, poster });

  React.useEffect(() => {
    return () => cast.pause();
  }, []);

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
            {interacted && <video src={src} controls autoPlay />}
          </>
        )}
        {cast.connected && (
          <VideoEmbedCastControls>
            {cast.paused ? (
              <button onClick={cast.play}>Play</button>
            ) : (
              <button onClick={cast.pause}>Pause</button>
            )}
          </VideoEmbedCastControls>
        )}
      </VideoEmbedWrapper>
      <VideoEmbedCast>
        {/* @ts-ignore */}
        <google-cast-launcher />
      </VideoEmbedCast>
    </>
  );
}
