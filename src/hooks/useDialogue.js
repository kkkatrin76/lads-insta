// Manage the dialogue state.

import { useEffect, useState } from "react";
import { processEvents } from "../engine/DialogueEngine";

export default function useDialogue(post, scene) {
  const [state, setState] = useState(post.initialState);

  function choose(choice) {
    setState((prev) => processEvents(prev, choice.events));
  }

  useEffect(() => {
    if (typeof window === "undefined" || !scene || !state.addedPosts?.length) {
      return;
    }

    const savedGameState = window.localStorage.getItem("game-state");
    const parsedGameState = savedGameState ? JSON.parse(savedGameState) : {};
    const scenePosts = parsedGameState.scenePosts ?? {};
    const existingScenePosts = Array.isArray(scenePosts[scene]) ? scenePosts[scene] : [];
    const nextPosts = [...state.addedPosts, ...existingScenePosts];
    const seenIds = new Set();

    const dedupedPosts = nextPosts.filter((candidatePost) => {
      if (!candidatePost?.id || seenIds.has(candidatePost.id)) {
        return false;
      }

      seenIds.add(candidatePost.id);
      return true;
    });

    const updatedGameState = {
      ...parsedGameState,
      scenePosts: {
        ...scenePosts,
        [scene]: dedupedPosts,
      },
    };

    window.localStorage.setItem("game-state", JSON.stringify(updatedGameState));
  }, [scene, state.addedPosts]);

  const currentChoices =
    post.dialogue[state.currentStep]?.choices ?? [];

  return {
    state,
    choose,
    currentChoices
  };
}