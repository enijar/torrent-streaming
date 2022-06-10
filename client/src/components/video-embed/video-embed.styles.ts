import styled from "styled-components";

export const VideoEmbedWrapper = styled.div`
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;

  svg {
    width: 5em;
  }

  video {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;
