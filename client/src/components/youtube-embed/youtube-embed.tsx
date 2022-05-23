import React from "react";
import { YoutubeEmbedWrapper } from "@/components/youtube-embed/youtube-embed.styles";

type Props = {
  code: string;
};

export default function YoutubeEmbed({ code }: Props) {
  return (
    <YoutubeEmbedWrapper>
      <iframe src={`https://www.youtube.com/embed/${code}`} />
    </YoutubeEmbedWrapper>
  );
}
