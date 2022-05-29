import React from "react";
import {
  StreamRating,
  StreamInfo,
  StreamCover,
  StreamWrapper,
} from "@/components/stream/stream.styles";
import { Stream as StreamType } from "@/types";
import { MAX_RATING } from "@/consts";
import Star from "@/icons/star";

type Props = StreamType & {
  //
};

export default function Stream({
  title,
  largeCoverImage,
  rating,
  year,
}: Props) {
  return (
    <StreamWrapper>
      <StreamCover>
        <img src={largeCoverImage} alt={title} loading="lazy" />
      </StreamCover>
      <StreamInfo>
        <StreamRating rating={rating}>
          {Array.from(Array(MAX_RATING)).map((_, index) => {
            return <Star key={index} />;
          })}
        </StreamRating>
        <time>{year}</time>
      </StreamInfo>
      <h3>{title}</h3>
    </StreamWrapper>
  );
}
