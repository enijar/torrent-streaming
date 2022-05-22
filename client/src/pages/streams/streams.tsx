import React from "react";
import { useNavigate } from "react-router-dom";
import { StreamsWrapper } from "@/pages/streams/streams.styles";
import api from "@/services/api";
import { Stream as StreamType } from "@/types";
import Loading from "@/components/loading/loading";
import Stream from "@/components/stream/stream";

export default function Streams() {
  const navigate = useNavigate();

  const [streams, setStreams] = React.useState<StreamType[]>([]);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api
      .get("/api/streams")
      .then((res) => {
        if (res.status === 401) {
          return navigate("/");
        }
        setLoading(false);
        setStreams(res.data?.streams ?? []);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <Loading />;

  return (
    <StreamsWrapper>
      {streams.map((stream) => {
        return <Stream key={stream.uuid} {...stream} />;
      })}
    </StreamsWrapper>
  );
}
