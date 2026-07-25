// Manage the dialogue state.

import { useEffect, useState } from "react";
import { processEvents } from "../engine/DialogueEngine";

const DEFAULT_REPLY_DELAY_MS = 2000;

function getReplyDelayMs(post, event) {
  if (typeof event?.replyDelayMs === "number") {
    return event.replyDelayMs;
  }

  if (typeof post?.replyDelayMs === "number") {
    return post.replyDelayMs;
  }

  return DEFAULT_REPLY_DELAY_MS;
}

export default function useDialogue(post, scene) {
  const [state, setState] = useState(() => ({
    ...(post.initialState ?? {}),
    comments: post.comments ?? {},
  }));

  function choose(choice, customText) {
    const trimmedText = String(customText ?? "").trim();
    const choiceEvents = Array.isArray(choice?.events) ? choice.events : [];

    if (trimmedText) {
      const customCommentId = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const customComment = {
        id: customCommentId,
        user: "me",
        text: trimmedText,
        children: [],
        choices: [],
      };

      setState((prev) => processEvents(prev, [], customComment));

      choiceEvents.forEach((event, index) => {
        const shouldSkipFirstShowComment = index === 0 && event.type === "SHOW_COMMENT";

        if (shouldSkipFirstShowComment) {
          return;
        }

        const replyDelayMs = getReplyDelayMs(post, event);

        window.setTimeout(() => {
          setState((prev) => processEvents(prev, [event]));
        }, replyDelayMs * (index + 1));
      });

      return;
    }

    choiceEvents.forEach((event, index) => {
      const replyDelayMs = getReplyDelayMs(post, event);

      window.setTimeout(() => {
        setState((prev) => processEvents(prev, [event]));
      }, replyDelayMs * (index + 1));
    });
  }

  useEffect(() => {
    if (typeof window === "undefined" || !scene) {
      return;
    }

    if (!state.addedPosts?.length) {
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
    (post?.dialogue ?? {})[state.currentStep]?.choices ?? [];

  return {
    state,
    choose,
    currentChoices
  };
}