import styled from "styled-components";

export const SearchWrapper = styled.div`
  position: sticky;
  z-index: 1;
  top: 0;
  margin-top: -0.5em;
  margin-bottom: -0.5em;
  height: 3em;
  background-color: var(--color-dark);
  padding: 0.5em;

  input {
    display: block;
    border: none;
    padding-inline: 0.5em;
    width: 100%;
    height: 100%;
  }
`;
