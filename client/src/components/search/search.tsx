import React from "react";
import { SearchWrapper } from "@/components/search/search.styles";

type Props = {
  onChange: (value: string) => void;
};

export default function Search({ onChange }: Props) {
  const onChangeRef = React.useRef(onChange);
  React.useMemo(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeRef.current(event.currentTarget.value.trim());
    },
    []
  );

  return (
    <SearchWrapper>
      <input
        onChange={handleChange}
        placeholder="Search for a movie title..."
      />
    </SearchWrapper>
  );
}
