import styled from "styled-components";

export const LoadingSpinner = styled.div`
  display: inline-block;
  position: relative;
  width: 4em;
  height: 4em;

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 3.2em;
    height: 3.2em;
    margin: 0.4em;
    border-width: 0.4em;
    border-style: solid;
    border-color: #fff transparent transparent transparent;
    border-radius: 50%;
    animation: loading-spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;

    :nth-child(1) {
      animation-delay: -0.45s;
    }

    :nth-child(2) {
      animation-delay: -0.3s;
    }

    :nth-child(3) {
      animation-delay: -0.15s;
    }
  }

  @keyframes loading-spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingWrapper = styled.div`
  --scale: 3;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: min(var(--scale) * 1vw, var(--scale) * 1vh);
`;
