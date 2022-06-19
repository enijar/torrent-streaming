import styled from "styled-components";

export const VideoEmbedCast = styled.div`
  width: 3em;
`;

export const VideoEmbedCastControls = styled.div`
  //
`;

export const VideoEmbedWrapper = styled.div`
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  background-size: cover;
  background-position: 50%;

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
