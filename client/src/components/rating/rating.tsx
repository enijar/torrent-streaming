import React from "react";
import { RatingWrapper } from "@/components/rating/rating.styles";
import { MAX_RATING } from "@/consts";
import Star from "@/icons/star";

type Props = {
  $rating: number;
};

export default function Rating(props: Props) {
  return (
    <RatingWrapper $rating={props.$rating}>
      {Array.from(Array(MAX_RATING)).map((_, index) => {
        return <Star key={index} />;
      })}
    </RatingWrapper>
  );
}
