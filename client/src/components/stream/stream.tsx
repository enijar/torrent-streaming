import React from "react";
import { StreamCover, StreamInfo, StreamWrapper } from "@/components/stream/stream.styles";
import { Stream as StreamType } from "@/types";
import Rating from "@/components/rating/rating";
import { asset } from "@/utils";

type Props = StreamType;

export default function Stream(props: Props) {
  const poster = React.useMemo(() => {
    return asset(props.largeCoverImage);
  }, [props.largeCoverImage]);

  return (
    <StreamWrapper to={`/streams/${props.uuid}`} title={props.title}>
      <StreamCover>
        <img src={poster} alt={props.title} loading="lazy" />
      </StreamCover>
      <StreamInfo>
        <Rating $rating={props.rating} />
        <time>{props.year}</time>
      </StreamInfo>
      <h3>{props.title}</h3>
    </StreamWrapper>
  );
}
