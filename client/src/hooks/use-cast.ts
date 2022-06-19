import React from "react";
import { Stream } from "@/types";

const win = window as any;

let castAppended = false;
let castAvailable = false;

type UseCast = {
  connected: boolean;
  paused: boolean;
  loaded: boolean;
  play: () => void;
  pause: () => void;
  stop: () => void;
};

export default function useCast(
  stream: Stream,
  { src, poster }: { src: string; poster: string }
): UseCast {
  const [available, setAvailable] = React.useState(castAvailable);
  const [connected, setConnected] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [session, setSession] = React.useState<any>(null);
  const [remotePlayer, setRemotePlayer] = React.useState<any>(null);
  const [remotePlayerController, setRemotePlayerController] =
    React.useState<any>(null);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (castAppended) return;
    win["__onGCastApiAvailable"] = (available: boolean) => {
      castAvailable = available;
      setAvailable(available);
    };
    const script = document.createElement("script");
    script.src = `https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1`;
    document.body.appendChild(script);
    castAppended = true;
  }, []);

  React.useEffect(() => {
    if (!available) return;
    win.cast.framework.CastContext.getInstance().setOptions({
      receiverApplicationId:
        win.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: win.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
    });
    const castRemotePlayer = new win.cast.framework.RemotePlayer();
    const castRemotePlayerController =
      new win.cast.framework.RemotePlayerController(castRemotePlayer);

    setPaused(castRemotePlayer.isPaused);
    setConnected(castRemotePlayer.isConnected);
    setRemotePlayer(castRemotePlayer);
    setRemotePlayerController(castRemotePlayerController);

    function onConnectionChanged(event: any) {
      setConnected(event.value);
    }

    function onPauseChanged(event: any) {
      setPaused(event.value);
    }

    castRemotePlayerController.addEventListener(
      win.cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
      onConnectionChanged
    );
    castRemotePlayerController.addEventListener(
      win.cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED,
      onPauseChanged
    );

    return () => {
      castRemotePlayerController.removeEventListener(
        win.cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        onConnectionChanged
      );
      castRemotePlayerController.removeEventListener(
        win.cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED,
        onPauseChanged
      );
    };
  }, [available]);

  React.useEffect(() => {
    if (!connected) return;
    const castSession =
      win.cast.framework.CastContext.getInstance().getCurrentSession();
    setSession(castSession);
  }, [connected]);

  React.useEffect(() => {
    if (!remotePlayerController) return;
    if (!session) return;
    const mediaInfo = new win.chrome.cast.media.MediaInfo(src, "video/mp4");
    mediaInfo.metadata = new win.chrome.cast.media.GenericMediaMetadata();
    mediaInfo.metadata.metadataType =
      win.chrome.cast.media.MetadataType.GENERIC;
    mediaInfo.metadata.title = stream.title;
    mediaInfo.metadata.images = [{ url: poster }];
    const request = new win.chrome.cast.media.LoadRequest(mediaInfo);
    session
      .loadMedia(request)
      .then(() => {
        setLoaded(true);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, [session, stream, src, poster, remotePlayerController, remotePlayer]);

  const play = React.useCallback(() => {
    if (!remotePlayerController || !remotePlayer) return;
    if (!remotePlayer.isPaused) return;
    remotePlayerController.playOrPause();
  }, [remotePlayerController, remotePlayer]);

  const pause = React.useCallback(() => {
    if (!remotePlayerController || !remotePlayer) return;
    if (remotePlayer.isPaused) return;
    remotePlayerController.playOrPause();
  }, [remotePlayerController, remotePlayer]);

  const stop = React.useCallback(() => {
    if (!remotePlayerController) return;
    remotePlayerController.stop();
  }, [remotePlayerController]);

  return React.useMemo((): UseCast => {
    return { connected, paused, play, pause, stop, loaded };
  }, [connected, paused, play, pause, stop, loaded]);
}
