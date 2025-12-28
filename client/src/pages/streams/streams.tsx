import React from "react";
import { StreamsContainer, StreamsSentinel, StreamsWrapper } from "@/pages/streams/streams.styles";
import Search from "@/components/search/search";
import { Outlet } from "react-router-dom";
import StreamsList from "@/components/streams-list/streams-list.tsx";

export default function Streams() {
  const [page, setPage] = React.useState(1);
  const [query, setQuery] = React.useState("");

  const loadingRef = React.useRef(false);
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const hasLoadedFirstPageRef = React.useRef(false);

  const onLoading = React.useCallback(
    (loading: boolean) => {
      loadingRef.current = loading;
      // Mark that we've loaded the first page
      if (!loading && page === 1) {
        hasLoadedFirstPageRef.current = true;
      }
    },
    [page],
  );

  const onChange = React.useCallback((value: string) => {
    window.scrollTo(0, 0);
    loadingRef.current = false;
    hasLoadedFirstPageRef.current = false;
    setPage(1);
    setQuery(value);
  }, []);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (sentinel === null) return;
    const observer = new IntersectionObserver(
      (entries) => {
        console.log(!loadingRef.current && hasLoadedFirstPageRef.current);
        const entry = entries[0];
        if (entry.isIntersecting && !loadingRef.current && hasLoadedFirstPageRef.current) {
          loadingRef.current = true;
          setPage((page) => page + 1);
        }
      },
      {
        rootMargin: "0px 0px 200px 0px",
      },
    );
    observer.observe(sentinel);
    return observer.disconnect;
  }, [query]);

  return (
    <>
      <Outlet />
      <StreamsWrapper>
        <StreamsContainer>
          <Search onChange={onChange} />
          <StreamsList page={page} query={query} onLoading={onLoading} />
          <StreamsSentinel ref={sentinelRef} />
        </StreamsContainer>
      </StreamsWrapper>
    </>
  );
}
