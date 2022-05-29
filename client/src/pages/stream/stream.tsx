import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  StreamBack,
  StreamSynopsis,
  StreamWrapper,
} from "@/pages/stream/stream.styles";
import api from "@/services/api";
import { Request, Stream as StreamType } from "@/types";
import Loading from "@/components/loading/loading";
import VideoEmbed from "@/components/video-embed/video-embed";
import config from "@/config";

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
    req
      .send()
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
      <StreamBack to="/streams">
        <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            d="M39.3756,48.0022l30.47-25.39a6.0035,6.0035,0,0,0-7.6878-9.223L26.1563,43.3906a6.0092,6.0092,0,0,0,0,9.2231L62.1578,82.615a6.0035,6.0035,0,0,0,7.6878-9.2231Z"
          />
        </svg>
        <span>Back to Streams</span>
      </StreamBack>
      <h1>{stream.title}</h1>
      <VideoEmbed src={`${config.apiUrl}/api/watch/${stream.uuid}`} />
      <StreamSynopsis>
        <h3>Synopsis</h3>
        <p dangerouslySetInnerHTML={{ __html: stream.synopsis }} />
      </StreamSynopsis>
    </StreamWrapper>
  );
}
