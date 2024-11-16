import React from "react";
import { toCanvas } from "qrcode";
import { QrLoginWrapper } from "@/components/qr-login/qr-login.styles";
import config from "@/config";

type Props = {
  socketId: string;
};

export default function QrLogin(props: Props) {
  const [requested, setRequested] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (canvasRef.current === null) return;
    const link = `${config.apiUrl}/api/login/qr/${props.socketId}`;
    toCanvas(canvasRef.current, link, { width: 350 }).catch((err) => console.error(err));
  }, [props.socketId]);

  return (
    <QrLoginWrapper>
      <canvas ref={canvasRef} style={{ display: !requested ? "none" : "block" }} />
      {!requested && (
        <button type="button" onClick={() => setRequested(true)}>
          Login with phone
        </button>
      )}
    </QrLoginWrapper>
  );
}
