// Display one comment recursively.

import { getDisplayName } from "../engine/userDisplay";
import { applyNameTemplate } from "../utils/templateText";

function getCurrentProfile() {
  if (typeof window === "undefined") {
    return {
      name: "You",
      image: "./icons/you.png",
    };
  }

  return {
    name: window.localStorage.getItem("dashboard-name") || "You",
    image: window.localStorage.getItem("user-pfp") || "./icons/you.png",
  };
}

function getUserLabel(userId, profile) {
  return userId === "me" ? profile.name : getDisplayName(userId, userId || "Unknown");
}

function renderCommentLine(comment, profile) {
  const displayName = getUserLabel(comment.user, profile);
  const commentText = applyNameTemplate(comment.text, profile.name);

  if (comment.replyTo) {
    const replyToName = getUserLabel(comment.replyTo, profile);

    return (
      <div>
        <span className="username">{displayName}</span> replied to <span className="username">{replyToName}</span>: <span>{commentText}</span>
      </div>
    );
  }

  return (
    <div>
      <span className="username">{displayName}</span>: <span>{commentText}</span>
    </div>
  );
}

export function CommentList({ comments, visibleComments = [], selectedChoices = {}, onChoose }) {
  return visibleComments
    .filter((commentId) => Boolean(comments?.[commentId]))
    .map((commentId) => {
      const comment = comments[commentId];
      const profile = getCurrentProfile();
      // const displayImage = isCurrentUser ? profile.image : `/icons/${comment.user}.png`;

      return (
        <div key={commentId}>
          {renderCommentLine(comment, profile)}

          {!selectedChoices[commentId] &&
            comment.choices?.map((choice, index) => (
              <button
                key={choice.id ?? `${commentId}-choice-${index}`}
                onClick={() => onChoose?.(commentId, choice)}
              >
                {choice.text}
              </button>
            ))}

          {comment.children?.map((childId) => (
            <Comment
              key={childId}
              commentId={childId}
              comments={comments}
              visibleComments={visibleComments}
              selectedChoices={selectedChoices}
              onChoose={onChoose}
              depth={1}
            />
          ))}
        </div>
      );
    });
}

export default function Comment({
  commentId,
  comments,
  visibleComments,
  selectedChoices,
  onChoose,
  depth = 0,
}) {
  if (!visibleComments.includes(commentId)) return null;

  const comment = comments[commentId];
  const profile = getCurrentProfile();
  // const displayImage = isCurrentUser ? profile.image : null;

  return (
    <div
      style={{
        marginLeft: depth * 24,
        borderLeft: "2px solid #ddd",
        paddingLeft: 12,
        marginTop: 12,
      }}
    >
      {renderCommentLine(comment, profile)}

      {!selectedChoices[commentId] &&
        comment.choices?.map((choice, index) => (
          <button
            key={choice.id ?? `${commentId}-choice-${index}`}
            onClick={() => onChoose(commentId, choice)}
          >
            {choice.text}
          </button>
        ))}

      {comment.children?.map((childId) => (
        <Comment
          key={childId}
          commentId={childId}
          comments={comments}
          visibleComments={visibleComments}
          selectedChoices={selectedChoices}
          onChoose={onChoose}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}