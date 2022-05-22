import styled from "styled-components";

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

export const StreamWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 0.5em;

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
