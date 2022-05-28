import styled from "styled-components";

export const StreamsList = styled.div`
  --cols: 5;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(250px, 1fr));
  justify-content: center;

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

export const StreamsContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
`;

export const StreamsWrapper = styled.main`
  padding: 0.5em;
`;
