import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StreamWrapper } from "@/pages/stream/stream.styles";
import api from "@/services/api";
import { Stream as StreamType } from "@/types";
import Loading from "@/components/loading/loading";
import YoutubeEmbed from "@/components/youtube-embed/youtube-embed";

export default function Stream() {
  const { uuid } = useParams();

  const navigate = useNavigate();

  const [stream, setStream] = React.useState<StreamType>(null);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api
      .get(`/api/stream/${uuid}`)
      .then((res) => {
        if (res.status === 401) {
          return navigate("/");
        }
        setLoading(false);
        setStream(res.data?.stream ?? null);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate, uuid]);

  if (loading) return <Loading />;

  if (stream === null) return <h3>Stream Not Found</h3>;

  return (
    <StreamWrapper>
      <YoutubeEmbed code={stream.youTubeTrailerCode} />
    </StreamWrapper>
  );
}
