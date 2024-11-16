import React from "react";
import { SearchWrapper } from "@/components/search/search.styles";

type Props = {
  onChange: (value: string) => void;
};

export default function Search(props: Props) {
  return (
    <SearchWrapper>
      <input
        onChange={(event) => {
          props.onChange(event.currentTarget.value.trim());
        }}
        placeholder="Search for a movie title..."
      />
    </SearchWrapper>
  );
}
