import React from "react";
import { RatingWrapper } from "@/components/rating/rating.styles";
import { MAX_RATING } from "@/consts";
import Star from "@/icons/star";

type Props = {
  rating: number;
};

export default function Rating({ rating }: Props) {
  return (
    <RatingWrapper rating={rating}>
      {Array.from(Array(MAX_RATING)).map((_, index) => {
        return <Star key={index} />;
      })}
    </RatingWrapper>
  );
}
