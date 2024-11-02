import styled from "styled-components";

export const VideoEmbedWrapper = styled.div`
  aspect-ratio: 16 / 9;
  position: relative;
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

    :focus {
      outline: 0.1em solid #03a9f4;
      outline-offset: 0.1em;
      border-radius: 0.1em;
    }
  }
`;
