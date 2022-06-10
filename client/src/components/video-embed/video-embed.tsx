import React from "react";
import { VideoEmbedWrapper } from "@/components/video-embed/video-embed.styles";

type Props = {
  src: string;
};

export default function VideoEmbed({ src }: Props) {
  const [interacted, setInteracted] = React.useState(false);

  return (
    <VideoEmbedWrapper
      onClick={() => setInteracted(true)}
      style={{ cursor: interacted ? "auto" : "pointer" }}
    >
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
      {interacted && <video src={src} controls />}
    </VideoEmbedWrapper>
  );
}
