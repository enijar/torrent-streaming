import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { StreamsWrapper } from "@/pages/streams/streams.styles";
import { Stream as StreamType } from "@/types";
import Stream from "@/components/stream/stream";
import stream from "@/services/stream";

export default function Streams() {
  const navigate = useNavigate();

  const [streams, setStreams] = React.useState<StreamType[]>([]);

  const pageRef = React.useRef(1);
  const loadingRef = React.useRef(false);

  const updateStreams = React.useCallback(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    stream.streamsFromPage(pageRef.current).then((streams) => {
      if (streams === false) return navigate("/");
      if (streams.length === 0) return;
      pageRef.current++;
      setStreams((currentStreams) => {
        return [...currentStreams, ...streams];
      });
    });
  }, [navigate]);

  React.useEffect(() => {
    loadingRef.current = false;
  }, [streams]);

  React.useEffect(updateStreams, [updateStreams]);

  const onScroll = React.useCallback((event: React.UIEvent) => {
    const target = event.currentTarget;
    const maxScrollTop = target.scrollHeight - target.clientHeight;
    const progress = target.scrollTop / maxScrollTop;
    if (progress >= 0.95) updateStreams();
  }, []);

  return (
    <StreamsWrapper onScroll={onScroll}>
      {streams.map((stream) => {
        return (
          <Link key={stream.uuid} to={`/stream/${stream.uuid}`}>
            <Stream {...stream} />
          </Link>
        );
      })}
    </StreamsWrapper>
  );
}
