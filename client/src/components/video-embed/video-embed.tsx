import React from "react";
import { VideoEmbedWrapper } from "@/components/video-embed/video-embed.styles";

type Props = {
  src: string;
};

export default function VideoEmbed({ src }: Props) {
  return (
    <VideoEmbedWrapper>
      <video src={src} controls autoPlay />
    </VideoEmbedWrapper>
  );
}
