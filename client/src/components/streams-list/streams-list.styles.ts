import styled from "styled-components";
import { StreamWrapper } from "@/components/stream/stream.styles";

export const StreamsListWrapper = styled.div`
  --cols: 5;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(250px, 1fr));
  justify-content: center;

  :hover ${StreamWrapper}:not(:hover) {
    filter: grayscale(100%);
    opacity: 0.25;
  }

  @media (max-width: 1300px) {
    --cols: 4;
  }

  @media (max-width: 1050px) {
    --cols: 3;
  }

  @media (max-width: 800px) {
    --cols: 2;
  }

  @media (max-width: 600px) {
    --cols: auto-fit;
  }
`;
