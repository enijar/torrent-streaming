import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { MAX_RATING } from "@/consts";

type RatingProps = {
  rating: number;
};

export const StreamRating = styled.div<RatingProps>`
  display: flex;
  align-items: center;
  gap: 0.2em;

  svg {
    width: 0.5em;

    ${({ rating }) => {
      return Array.from(Array(MAX_RATING)).map((_, index) => {
        const number = index + 1;
        return css`
          :nth-child(${number}) {
            opacity: ${number > rating ? 0.25 : 1};
          }
        `;
      });
    }}
  }
`;

export const StreamInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  time {
    font-size: 0.8em;
  }
`;

export const StreamCover = styled.div`
  aspect-ratio: 500 / 750;
  background-color: hsl(0deg 0% 0%);
  animation: stream-cover-loading 2000ms linear infinite;

  @keyframes stream-cover-loading {
    0%,
    100% {
      background-color: hsl(0deg 0% 0%);
    }
    50% {
      background-color: hsl(0deg 0% 20%);
    }
  }
`;

export const StreamWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 0.5em;
  transition: filter 400ms ease, opacity 400ms ease;

  img {
    display: block;
    width: 100%;
    max-width: 100%;
  }

  h3 {
    font-size: 0.85em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-block-start: auto;
  }
`;
