import create from "zustand";
import React from "react";
import config from "@/config";

/**
 * @note references:
 * - https://developers.google.com/cast/docs/web_sender/integrate
 */

const win = window as any;

type Media = {
  src: string;
  type?: string;
  metadata: {
    title: string;
    images?: Array<{ url: string }>;
  };
};

type UseChromecast = {
  init: () => void;
  available: boolean;
  connected: boolean;
  button: React.ReactNode;
  load: (media: Media) => void;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  stop: () => void;
  currentTime: number;
  canSeek: boolean;
  playerState: "IDLE" | "BUFFERING" | "PLAYING" | "PAUSED";
  mediaInfo: {
    contentId: string;
    duration: number;
  };
};

let button: React.ReactNode = null;

export const useChromecast = create<UseChromecast>((set, get) => {
  if (button === null) {
    button = React.createElement("google-cast-launcher");
  }

  let initialized = false;
  let session: typeof win.cast.framework.CastContext.Session = null;
  let remotePlayer: typeof win.cast.framework.RemotePlayer;
  let remotePlayerController: typeof win.cast.framework.RemotePlayerController;

  function onChange(event: any) {
    if (config.env === "development") {
      console.log(event.field, event.value);
    }

    switch (event.field) {
      case "isConnected":
        const connected = event.value;
        if (connected && session === null) {
          session =
            win.cast.framework.CastContext.getInstance().getCurrentSession();
        }
        set({ connected: connected });
        if (!connected) {
          set({ mediaInfo: null });
        }
        break;
      case "currentTime":
        const currentTime = event.value;
        set({ currentTime });
        break;
      case "canSeek":
        const canSeek = event.value;
        set({ canSeek });
        break;
      case "playerState":
        const playerState = event.value;
        set({ playerState });
        break;
      case "mediaInfo":
        const mediaInfo = event.value;
        set({ mediaInfo });
        break;
    }
  }

  return {
    init() {
      if (initialized) return;
      initialized = true;

      win["__onGCastApiAvailable"] = (available: boolean) => {
        if (!available) return;

        win.cast.framework.CastContext.getInstance().setOptions({
          receiverApplicationId:
            win.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
          autoJoinPolicy: win.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
        });

        remotePlayer = new win.cast.framework.RemotePlayer();
        remotePlayerController = new win.cast.framework.RemotePlayerController(
          remotePlayer
        );

        if (!remotePlayer || !remotePlayerController) return;

        set({ available });

        remotePlayerController.addEventListener(
          win.cast.framework.RemotePlayerEventType.ANY_CHANGE,
          onChange
        );
      };

      const script = document.createElement("script");
      script.src = `https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1`;
      document.body.appendChild(script);
    },
    available: false,
    connected: false,
    load(media) {
      if (!session) return;
      if (media.src === get().mediaInfo?.contentId) return;
      const mediaInfo = new win.chrome.cast.media.MediaInfo(
        media.src,
        media.type ?? "video/mp4"
      );
      mediaInfo.metadata = new win.chrome.cast.media.GenericMediaMetadata();
      mediaInfo.metadata.metadataType =
        win.chrome.cast.media.MetadataType.GENERIC;
      mediaInfo.metadata.title = media.metadata.title;
      mediaInfo.metadata.images = media.metadata.images ?? [];
      const request = new win.chrome.cast.media.LoadRequest(mediaInfo);
      session.loadMedia(request).catch((err: any) => {
        console.error(err);
      });
    },
    play() {
      if (!remotePlayerController || get().playerState !== "PAUSED") return;
      set({ playerState: "PLAYING" });
      remotePlayerController.playOrPause();
    },
    pause() {
      if (!remotePlayerController || get().playerState !== "PLAYING") return;
      set({ playerState: "PAUSED" });
      remotePlayerController.playOrPause();
    },
    seek(time) {
      if (!remotePlayer || !remotePlayerController) return;
      remotePlayer.currentTime = time;
      remotePlayerController.seek();
    },
    stop() {
      if (!remotePlayerController) return;
      remotePlayerController.stop();
      set({ mediaInfo: null });
    },
    button,
    currentTime: 0,
    canSeek: false,
    playerState: "IDLE",
    mediaInfo: null,
  };
});
