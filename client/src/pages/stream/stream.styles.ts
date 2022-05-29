import styled from "styled-components";
import { Link } from "react-router-dom";

export const StreamBack = styled(Link)`
  font-size: 0.8em;
  line-height: 1em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.25em;

  svg {
    display: block;
    max-width: 1em;
    transform: translateY(-0.075em);
  }
`;

export const StreamSynopsis = styled.div`
  h3 {
    font-size: 0.9em;
    margin-bottom: 0.5em;
  }

  p {
    font-size: 0.8em;
    line-height: 1.5em;
  }
`;

export const StreamTrailer = styled.a`
  display: flex;
  gap: 1ch;

  svg {
    max-width: 5em;
  }
`;

export const StreamWrapper = styled.main`
  padding: 1em;
  display: grid;
  grid-template-columns: minmax(250px, 50em);
  grid-auto-rows: max-content;
  justify-content: center;
  gap: 1em;
`;
