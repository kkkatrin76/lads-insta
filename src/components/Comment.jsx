// Display one comment recursively.

function getCurrentProfile() {
  if (typeof window === "undefined") {
    return {
      name: "You",
      image: "/icons/you.png",
    };
  }

  return {
    name: window.localStorage.getItem("dashboard-name") || "You",
    image: window.localStorage.getItem("user-pfp") || "/icons/you.png",
  };
}

export function CommentList({ comments, visibleComments = [], selectedChoices = {}, onChoose }) {
  return Object.entries(comments ?? {}).map(([commentId, comment]) => {
    if (!visibleComments.includes(commentId)) {
      return null;
    }

    const profile = getCurrentProfile();
    const isCurrentUser = comment.user === "me";
    const displayName = isCurrentUser ? profile.name : (comment.user || "Unknown");
    // const displayImage = isCurrentUser ? profile.image : `/icons/${comment.user}.png`;

    return (
      <div key={commentId}>
        <div>
          <span className="username">{displayName}</span>: <span>{comment.text}</span>
        </div>

        

        {!selectedChoices[commentId] &&
          comment.choices?.map((choice) => (
            <button
              key={choice.id}
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
  const isCurrentUser = comment.user === "me";
  const displayName = isCurrentUser ? profile.name : (comment.user || "Unknown");
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
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* {displayImage && (
          <img
            className="post-pfp"
            src={displayImage}
            alt={displayName}
            style={{ width: 32, height: 32 }}
          />
        )} */}
        <strong>{displayName}</strong>
      </div>

      <div>{comment.text}</div>

      {!selectedChoices[commentId] &&
        comment.choices?.map((choice) => (
          <button
            key={choice.id}
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