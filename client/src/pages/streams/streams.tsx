import React from "react";
import { StreamsContainer, StreamsSentinel, StreamsWrapper } from "@/pages/streams/streams.styles";
import Search from "@/components/search/search";
import { Outlet } from "react-router-dom";
import StreamsList from "@/components/streams-list/streams-list.tsx";

export default function Streams() {
  const [page, setPage] = React.useState(1);
  const [query, setQuery] = React.useState("");
  const [hasLoadedFirstPage, setHasLoadedFirstPage] = React.useState(false);

  const loadingRef = React.useRef(false);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  const onLoading = React.useCallback(
    (loading: boolean) => {
      loadingRef.current = loading;
      // Mark that we've loaded the first page
      if (!loading && page === 1 && !hasLoadedFirstPage) {
        setHasLoadedFirstPage(true);
      }
    },
    [page, hasLoadedFirstPage],
  );

  const onChange = React.useCallback((value: string) => {
    window.scrollTo(0, 0);
    loadingRef.current = false;
    setHasLoadedFirstPage(false);
    setPage(1);
    setQuery(value);
  }, []);

  React.useEffect(() => {
    // Only set up observer after first page has loaded
    if (!hasLoadedFirstPage) return;

    const sentinel = sentinelRef.current;
    if (sentinel === null) return;

    // Skip the first callback since it reports initial state
    let isFirstCallback = true;

    const observer = new IntersectionObserver(
      (entries) => {
        // IntersectionObserver fires immediately with initial state
        // We only want to load more when user scrolls, not on initial setup
        if (isFirstCallback) {
          isFirstCallback = false;
          return;
        }

        const entry = entries[0];
        if (entry.isIntersecting && !loadingRef.current) {
          loadingRef.current = true;
          setPage((page) => page + 1);
        }
      },
      {
        rootMargin: "0px 0px 500px 0px",
      },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [query, hasLoadedFirstPage]);

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
