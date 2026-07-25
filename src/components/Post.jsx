// Display the post, comment thread, and choice bar.

import { useEffect, useRef, useState } from "react";
import useDialogue from "../hooks/useDialogue";
import { getDisplayImage, getDisplayName } from "../engine/userDisplay";
import { applyNameTemplate } from "../utils/templateText";
import ChoiceBar from "./ChoiceBar";
import { CommentList } from "./Comment";

export default function Post({ post, scene }) {
  const {
    state,
    currentChoices,
    choose
  } = useDialogue(post, scene);
  const [isChoiceBarVisible, setIsChoiceBarVisible] = useState(Boolean(currentChoices.length));
  const lastNotificationIdRef = useRef(null);

  const profileName =
    typeof window === "undefined"
      ? "You"
      : window.localStorage.getItem("dashboard-name") || "You";

  const profileImage =
    typeof window === "undefined"
      ? "./icons/you.png"
      : window.localStorage.getItem("user-pfp") || "./icons/you.png";

  const displayUserName = post.user === "me" ? profileName : getDisplayName(post.user, post.user);
  const displayUserImage = post.user === "me" ? profileImage : getDisplayImage(post.user);
  const displayCaption = applyNameTemplate(post.caption, profileName);
  const mergedComments = {
    ...(post.comments ?? {}),
    ...Object.fromEntries((state.customComments ?? []).map((comment) => [comment.id, comment])),
  };
  const choiceSignature = currentChoices.map((choice) => choice.id).join("|");

  useEffect(() => {
    setIsChoiceBarVisible(Boolean(currentChoices.length));
  }, [choiceSignature, state.currentStep]);

  useEffect(() => {
    if (!state.notifications?.length) {
      return;
    }

    const latestNotification = state.notifications[state.notifications.length - 1];
    if (latestNotification?.id && latestNotification.id === lastNotificationIdRef.current) {
      return;
    }

    lastNotificationIdRef.current = latestNotification.id;
    window.dispatchEvent(new CustomEvent("app:notify", { detail: latestNotification }));
  }, [state.notifications]);

  const handleChoose = (choice, submittedText) => {
    choose(choice, submittedText);
    setIsChoiceBarVisible(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "start", gap: 12, width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "start", gap: 12, width: "100%" }}>
        {/* Left side: pfp */}
        <div className="post-left">
          <img
            className="post-pfp"
            src={displayUserImage}
            alt={displayUserName}
          />
        </div>

        {/* Right side: post content & comments */}
        <div className="post-right">
          <div className="post-header">{displayUserName}</div>
          <p className="post-caption">{displayCaption}</p>
          {post.image && <img className="post-image" src={`./posts/${post.image}`} alt="Post" />}

          <div className="post-comments">
            <CommentList
              comments={mergedComments}
              visibleComments={state.visibleComments}
            />
          </div>
        </div>
      </div>

      {/* The replies bar fixed on the bottom of the page */}
      <div className="replies-panel">
        <ChoiceBar
          choices={currentChoices}
          onChoose={handleChoose}
          visible={isChoiceBarVisible}
        />
      </div>
    </div>
  );
}