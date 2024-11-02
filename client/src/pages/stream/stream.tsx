import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  StreamBack,
  StreamImdb,
  StreamNotFoundWrapper,
  StreamSynopsis,
  StreamTrailer,
  StreamWrapper,
} from "@/pages/stream/stream.styles";
import api from "@/services/api";
import { Request, Stream as StreamType } from "@/types";
import { Flex } from "@/styles/elements";
import Loading from "@/components/loading/loading";
import VideoEmbed from "@/components/video-embed/video-embed";
import Chevron from "@/icons/chevron";
import YoutubeLogo from "@/icons/youtube-logo";
import Rating from "@/components/rating/rating";
import ImdbLogo from "@/icons/imdb-logo";

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

  if (stream === null)
    return (
      <StreamNotFoundWrapper>
        <h3>
          404
          <br />
          Stream Not Found
        </h3>
        <StreamBack to="/streams">
          <Chevron />
          <span>Back to Streams</span>
        </StreamBack>
      </StreamNotFoundWrapper>
    );

  return (
    <StreamWrapper>
      <StreamBack to="/streams">
        <Chevron />
        <span>Back to Streams</span>
      </StreamBack>
      <h1>{stream.title}</h1>
      <Flex>
        <Rating $rating={stream.rating} />
        <time>{stream.year}</time>
      </Flex>
      <VideoEmbed stream={stream} />
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
      {stream.imdbCode.length > 0 && (
        <StreamImdb
          href={`https://www.imdb.com/title/${stream.imdbCode}`}
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          <p>View on IMDb</p>
          <ImdbLogo />
        </StreamImdb>
      )}
      <StreamSynopsis>
        <h3>Synopsis</h3>
        <p dangerouslySetInnerHTML={{ __html: stream.synopsis }} />
      </StreamSynopsis>
    </StreamWrapper>
  );
}
