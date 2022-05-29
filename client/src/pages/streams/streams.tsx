import React from "react";
import {
  StreamsContainer,
  StreamsWrapper,
} from "@/pages/streams/streams.styles";
import Search from "@/components/search/search";
import StreamsList from "@/components/streams-list/streams-list";

export default function Streams() {
  const [page, setPage] = React.useState(1);
  const [query, setQuery] = React.useState("");

  const loadingRef = React.useRef(false);

  const onScroll = React.useCallback((event: React.UIEvent) => {
    const target = event.currentTarget;
    const maxScrollTop = target.scrollHeight - target.clientHeight;
    const progress = target.scrollTop / maxScrollTop;
    if (progress === 1 && !loadingRef.current) {
      loadingRef.current = true;
      setPage((page) => page + 1);
    }
  }, []);

  const onLoading = React.useCallback((loading: boolean) => {
    loadingRef.current = loading;
  }, []);

  const onChange = React.useCallback((value: string) => {
    wrapperRef.current.scrollTop = 0;
    setPage(1);
    setQuery(value);
  }, []);

  const wrapperRef = React.useRef<HTMLDivElement>();

  return (
    <StreamsWrapper ref={wrapperRef} onScroll={onScroll}>
      <StreamsContainer>
        <Search onChange={onChange} />
        <StreamsList page={page} query={query} onLoading={onLoading} />
      </StreamsContainer>
    </StreamsWrapper>
  );
}
