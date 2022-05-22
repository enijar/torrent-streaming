import styled from "styled-components";
import { Message, Error } from "@/styles/elements";

export const LoginWrapper = styled.main`
  display: grid;
  grid-template-columns: calc(100% - 2em);
  place-items: center;
  place-content: center;

  h1 {
    margin-block-end: 1rem;
    font-size: 1.5em;
    text-transform: uppercase;
  }

  form {
    width: 100%;
    max-width: 350px;
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: max-content;
    gap: 1em;

    ${Message}, ${Error} {
      text-align: center;
    }
  }

  input {
    width: 100%;
    border: 1px solid #f0f0f0;
    padding: 0.5em;
    border-radius: 0.25em;

    :last-child {
      margin-block-end: 0;
    }
  }

  button {
    --lightness: 51%;
    cursor: pointer;
    border: 1px solid hsl(264deg 80% calc(var(--lightness) * 1.5));
    padding: 0.5em;
    border-radius: 0.25em;
    background-color: hsl(264deg 60% var(--lightness));
    transition: background-color 0.3s ease;
    text-transform: uppercase;

    :hover {
      --lightness: 45%;
    }
  }
`;
