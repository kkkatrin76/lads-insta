// Display the post, comment thread, and choice bar.

import useDialogue from "../hooks/useDialogue";
import ChoiceBar from "./ChoiceBar";
import { CommentList } from "./Comment";

export default function Post({ post, scene }) {
  const {
    state,
    currentChoices,
    choose
  } = useDialogue(post, scene);

  const profileName =
    typeof window === "undefined"
      ? "You"
      : window.localStorage.getItem("dashboard-name") || "You";

  const profileImage =
    typeof window === "undefined"
      ? "/icons/you.png"
      : window.localStorage.getItem("user-pfp") || "/icons/you.png";

  const displayUserName = post.user === "me" ? profileName : post.user;
  const displayUserImage = post.user === "me" ? profileImage : `/icons/${post.user}.png`;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img
          className="post-pfp"
          src={displayUserImage}
          alt={displayUserName}
        />
        <h2>{displayUserName}</h2>
      </div>

      <p>{post.caption}</p>
      {post.image && <img className="post-image" src={`/posts/${post.image}`} alt="Post" />}

      <div className="post-comments">
        <CommentList
          comments={post.comments}
          visibleComments={state.visibleComments}
        />
      </div>

      <div className="replies-panel">
        <ChoiceBar
          choices={currentChoices}
          onChoose={choose}
        />
      </div>
    </>
  );
}