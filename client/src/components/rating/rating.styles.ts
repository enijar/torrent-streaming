import styled, { css } from "styled-components";
import { MAX_RATING } from "@/consts";

type Props = {
  $rating: number;
};

export const RatingWrapper = styled.div<Props>`
  display: flex;
  align-items: center;
  gap: 0.2em;

  svg {
    width: 0.5em;

    ${(props) => {
      return Array.from(Array(MAX_RATING)).map((_, index) => {
        const number = index + 1;
        return css`
          &:nth-child(${number}) {
            opacity: ${number > props.$rating ? 0.25 : 1};
          }
        `;
      });
    }}
  }
`;
