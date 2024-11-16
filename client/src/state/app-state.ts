import { create } from "zustand/react";

type AppState = {
  interacted: boolean;
  setInteracted: (interacted: AppState["interacted"]) => void;
};

export const appState = create<AppState>((setState) => {
  return {
    interacted: false,
    setInteracted(interacted) {
      setState({ interacted });
    },
  };
});
