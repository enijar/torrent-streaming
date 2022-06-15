import React from "react";
import {
  StreamCover,
  StreamInfo,
  StreamWrapper,
} from "@/components/stream/stream.styles";
import { Stream as StreamType } from "@/types";
import Rating from "@/components/rating/rating";

type Props = StreamType & {
  //
};

export default function Stream({
  uuid,
  title,
  largeCoverImage,
  rating,
  year,
}: Props) {
  return (
    <StreamWrapper to={`/streams/${uuid}`} title={title}>
      <StreamCover>
        <img src={largeCoverImage} alt={title} loading="lazy" />
      </StreamCover>
      <StreamInfo>
        <Rating rating={rating} />
        <time>{year}</time>
      </StreamInfo>
      <h3>{title}</h3>
    </StreamWrapper>
  );
}
