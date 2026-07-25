// Apply dialogue rules.

function playIncomingCommentSound(commentId, commentData) {
  if (typeof window === "undefined") {
    return;
  }

  const audio = new Audio("/sfx/lad_bubble_sound.mp3");
  audio.volume = 0.6;

  const isFromUser = commentData?.user === "me";
  const isCustomComment = commentId?.startsWith("custom-");

  if (isFromUser || isCustomComment) {
    return;
  }

  audio.play().catch(() => {});
}

export function processEvents(state, events, customComment = null) {
  let next = {
    ...state,
    visibleComments: [...(state.visibleComments ?? [])],
    addedPosts: [...(state.addedPosts ?? [])],
    customComments: [...(state.customComments ?? [])],
    comments: {
      ...(state.comments ?? {}),
    },
    notifications: [...(state.notifications ?? [])],
  };

  const hasCustomComment = Boolean(customComment);

  if (hasCustomComment) {
    next.visibleComments.push(customComment.id);
    next.customComments.push(customComment);
  }

  let skipFirstShowComment = hasCustomComment;

  for (const event of events) {
    switch (event.type) {
      case "SHOW_COMMENT":
        if (skipFirstShowComment) {
          skipFirstShowComment = false;
          break;
        }

        next.visibleComments.push(event.comment);

        const commentId = event.comment;
        const commentData = next.comments?.[commentId];

        if (commentData) {
          playIncomingCommentSound(commentId, commentData);
        }
        break;

      case "SET_STEP":
        next.currentStep = event.step;
        break;

      case "ADD_POST":
        if (event.post) {
          next.addedPosts.push(event.post);
        }
        break;

      case "SHOW_NOTIFICATION":
        if (event.text) {
          next.notifications.push({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            text: event.text,
          });
        }
        break;

      default:
        break;
    }
  }

  return next;
}