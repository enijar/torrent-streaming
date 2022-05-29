import React from "react";
import { StreamCover, StreamWrapper } from "@/components/stream/stream.styles";
import { Stream as StreamType } from "@/types";

type Props = StreamType & {
  //
};

export default function Stream({ title, largeCoverImage }: Props) {
  return (
    <StreamWrapper>
      <StreamCover>
        {/* @todo add back */}
        <img src={largeCoverImage} alt={title} loading="lazy" />
      </StreamCover>
      <h3>{title}</h3>
    </StreamWrapper>
  );
}
