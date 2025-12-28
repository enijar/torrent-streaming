import React from "react";
import { useNavigate } from "react-router-dom";
import { StreamsListWrapper } from "@/components/streams-list/streams-list.styles";
import { Request, Stream as StreamType } from "@/types";
import Stream from "@/components/stream/stream";
import api from "@/services/api";

type Props = {
  page: number;
  query: string;
  onLoading?: (loading: boolean) => void;
};

export default function StreamsList(props: Props) {
  const navigate = useNavigate();

  const lastPageRef = React.useRef(1);
  const lastQueryRef = React.useRef("");

  const onLoadingRef = React.useRef(props.onLoading);
  React.useMemo(() => {
    onLoadingRef.current = props.onLoading;
  }, [props.onLoading]);

  const [streams, setStreams] = React.useState<StreamType[]>([]);

  const requestRef = React.useRef<Request | null>(null);

  const loadingRef = React.useRef(false);

  React.useEffect(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    if (onLoadingRef.current) {
      onLoadingRef.current(true);
    }

    const req = api.get(`/api/streams?page=${props.page}&q=${props.query}`);
    requestRef.current = req;

    req.send().then((res) => {
      if (res.status === 401) return navigate("/");

      // For aborted requests or errors, just use empty array
      const streams = (!res.ok && res.status === 500) ? [] : (res.data.streams ?? []);

      if (props.query !== lastQueryRef.current) {
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
  }, [props.page, props.query, navigate]);

  React.useEffect(() => {
    loadingRef.current = false;
    if (onLoadingRef.current) {
      onLoadingRef.current(false);
    }
    lastPageRef.current = props.page;
    lastQueryRef.current = props.query;
  }, [streams]);

  return (
    <StreamsListWrapper>
      {streams.map((stream) => {
        return <Stream key={stream.uuid} {...stream} />;
      })}
    </StreamsListWrapper>
  );
}
