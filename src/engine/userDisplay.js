import { usrids } from "../data/users";
import { initialState } from "./GameState";

function readSavedGameState() {
  if (typeof window === "undefined") {
    return initialState;
  }

  try {
    const savedGameState = window.localStorage.getItem("game-state");

    if (!savedGameState) {
      return initialState;
    }

    const parsedState = JSON.parse(savedGameState);

    return {
      ...initialState,
      ...parsedState,
      playerProfile: {
        ...initialState.playerProfile,
        ...(parsedState.playerProfile ?? {}),
      },
      customUsernames: {
        ...(parsedState.customUsernames ?? {}),
      },
    };
  } catch {
    return initialState;
  }
}

export function getGameStateSnapshot() {
  return readSavedGameState();
}

export function getDisplayName(userId, fallbackName = "Unknown") {
  const state = readSavedGameState();

  if (userId === "me") {
    return state.playerProfile?.name || initialState.playerProfile.name;
  }

  const customName = state.customUsernames?.[userId];

  if (typeof customName === "string" && customName.trim()) {
    return customName.trim();
  }

  return usrids[userId] || fallbackName || userId;
}

export function getDisplayImage(userId) {
  const state = readSavedGameState();

  if (userId === "me") {
    return state.playerProfile?.image || initialState.playerProfile.image;
  }

  return `/icons/${userId}.png`;
}
