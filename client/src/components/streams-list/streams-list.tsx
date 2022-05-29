import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { StreamsListWrapper } from "@/components/streams-list/streams-list.styles";
import { Request, Stream as StreamType } from "@/types";
import Stream from "@/components/stream/stream";
import api from "@/services/api";
import * as stream from "stream";

type Props = {
  page: number;
  query: string;
  onLoading?: (loading: boolean) => void;
};

export default function StreamsList({ page, query, onLoading }: Props) {
  const navigate = useNavigate();

  const lastPageRef = React.useRef(1);
  const lastQueryRef = React.useRef("");

  const onLoadingRef = React.useRef(onLoading);
  React.useMemo(() => {
    onLoadingRef.current = onLoading;
  }, [onLoading]);

  const [streams, setStreams] = React.useState<StreamType[]>([]);

  const requestRef = React.useRef<Request>(null);

  const loadingRef = React.useRef(false);

  React.useEffect(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    if (onLoadingRef.current) {
      onLoadingRef.current(true);
    }

    if (requestRef.current !== null) {
      requestRef.current.abort();
    }

    const req = api.get(`/api/streams?page=${page}&q=${query}`);
    requestRef.current = req;

    req.send().then((res) => {
      if (res.status === 401) return navigate("/");
      const streams = res.data.streams ?? [];
      if (query !== lastQueryRef.current) {
        setStreams(streams);
      } else {
        setStreams((currentStreams) => {
          const nextStreams: StreamType[] = [];
          const mixedStreams = [...currentStreams, ...streams];
          // Make sure there are no duplicates
          for (let i = 0, length = mixedStreams.length; i < length; i++) {
            const stream = mixedStreams[i];
            const index = nextStreams.findIndex((nextStream) => {
              return nextStream.uuid === stream.uuid;
            });
            if (index === -1) {
              nextStreams.push(stream);
            }
          }
          return nextStreams;
        });
      }
    });
  }, [page, query]);

  React.useEffect(() => {
    loadingRef.current = false;
    if (onLoadingRef.current) {
      onLoadingRef.current(false);
    }
    lastPageRef.current = page;
    lastQueryRef.current = query;
  }, [streams]);

  return (
    <StreamsListWrapper>
      {streams.map((stream) => {
        return (
          <Link key={stream.uuid} to={`/stream/${stream.uuid}`}>
            <Stream {...stream} />
          </Link>
        );
      })}
    </StreamsListWrapper>
  );
}
