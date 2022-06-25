import styled from "styled-components";

export const VideoEmbedCast = styled.div`
  width: 3em;
`;

export const VideoEmbedCastControlsPlayPause = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const VideoEmbedCastControlsTime = styled.div`
  position: absolute;
  left: 1em;
  bottom: 1em;
  width: calc(100% - 2em);
  display: grid;
  grid-template-columns: 5.5ch 1fr 5.5ch;
  align-items: center;
  gap: 1em;

  time {
    font-size: 0.8em;
  }

  input[type="range"] {
    //
  }
`;

export const VideoEmbedCastControls = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
`;

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
  }
`;
