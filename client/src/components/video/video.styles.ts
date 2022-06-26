import styled from "styled-components";

export const VideoPlayPause = styled.div<{ show: boolean }>`
  opacity: calc(100% * ${({ show }) => (show ? 1 : 0)});
  transition: opacity 300ms ease;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  svg {
    display: block;
    width: 3em;
    fill: currentColor;
  }
`;

export const VideoProgress = styled.div`
  --progress: 0;
  position: relative;
  width: 100%;
  height: 1em;
  background-color: #333333;
  border-radius: 1em;
  overflow: hidden;

  :after {
    content: "";
    display: block;
    width: calc(100% * var(--progress));
    height: 100%;
    background-color: #ff0000;
  }

  input[type="range"] {
    position: absolute;
    inset: 0;
    opacity: 0;
  }
`;

export const VideoControls = styled.div<{ show: boolean }>`
  transform: translateY(calc(100% * ${({ show }) => (show ? 0 : 1)}));
  transition: transform 300ms ease;
  position: absolute;
  display: grid;
  gap: 0.5em;
  grid-template-columns: 6ch 1fr 6ch;
  grid-template-rows: 1em;
  align-items: center;
  place-items: center;
  width: 100%;
  padding-inline: 0.5em;
  padding-block-start: 3em;
  padding-block-end: 1em;
  bottom: 0;
  background-image: linear-gradient(
    0deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0) 100%
  );

  time {
    font-size: 0.8em;
  }
`;

export const VideoPoster = styled.div`
  position: absolute;
  inset: 0;
  background-size: cover;
  pointer-events: none;
  background-position: 50%;
`;

export const VideoWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #000000;

  video {
    max-width: 100%;
    max-height: 100%;
  }
`;
