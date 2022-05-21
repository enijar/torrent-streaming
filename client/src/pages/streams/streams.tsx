import React from "react";
import { useNavigate } from "react-router-dom";
import { StreamsWrapper } from "@/pages/streams/streams.styles";
import api from "@/services/api";
import Loading from "@/components/loading/loading";

export default function Streams() {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api
      .get("/api/streams")
      .then((res) => {
        if (res.status === 401) {
          return navigate("/");
        }
        setLoading(false);
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
      <h1>Streams</h1>
    </StreamsWrapper>
  );
}
