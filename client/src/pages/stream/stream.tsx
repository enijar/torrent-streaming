import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  StreamBack,
  StreamSynopsis,
  StreamTrailer,
  StreamWrapper,
} from "@/pages/stream/stream.styles";
import api from "@/services/api";
import { Request, Stream as StreamType } from "@/types";
import Loading from "@/components/loading/loading";
import VideoEmbed from "@/components/video-embed/video-embed";
import config from "@/config";
import Chevron from "@/icons/chevron";
import YoutubeLogo from "@/icons/youtube-logo";

export default function Stream() {
  const { uuid } = useParams();

  const navigate = useNavigate();

  const [stream, setStream] = React.useState<StreamType>(null);

  const [loading, setLoading] = React.useState(true);

  const requestRef = React.useRef<Request>(null);

  React.useEffect(() => {
    if (requestRef.current !== null) {
      requestRef.current.abort();
    }
    const req = api.get(`/api/stream/${uuid}`);
    requestRef.current = req;
    req.send().then((res) => {
      if (res.status === 401) return navigate("/");
      setStream(res.data?.stream ?? null);
      setLoading(false);
    });
  }, [navigate, uuid]);

  if (loading) return <Loading />;

  if (stream === null) return <h3>Stream Not Found</h3>;

  return (
    <StreamWrapper>
      <StreamBack to="/streams">
        <Chevron />
        <span>Back to Streams</span>
      </StreamBack>
      <h1>{stream.title}</h1>
      <VideoEmbed
        src={`${config.apiUrl}/api/watch/${stream.uuid}`}
        poster={stream.largeCoverImage}
      />
      {stream.youTubeTrailerCode.length > 0 && (
        <StreamTrailer
          href={`https://youtube.com/watch?v=${stream.youTubeTrailerCode}`}
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          <p>Watch the trailer</p>
          <YoutubeLogo />
        </StreamTrailer>
      )}
      <StreamSynopsis>
        <h3>Synopsis</h3>
        <p dangerouslySetInnerHTML={{ __html: stream.synopsis }} />
      </StreamSynopsis>
    </StreamWrapper>
  );
}
