// Render one preview card.

import { Link } from "react-router-dom";
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function PostCard({ post, scene, profileName, profileImage }) {
  const currentProfileName = profileName || "You";
  const currentProfileImage = profileImage || "/icons/you.png";

  return (
    <Link
      to={`/post/${post.id}`}
      state={{ fromScene: scene }}
      onClick={() => {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(`scene-scroll-${scene}`, String(window.scrollY));
        }
      }}
      style={{
        textDecoration: "none",
        color: "inherit"
      }}
    >
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          cursor: "pointer"
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", alignItems: "start", gap: 12 }}>
          <div className="post-left">
            <img
              className="post-pfp"
              src={post.user === "me" ? currentProfileImage : `/icons/${post.user}.png`}
              alt={post.user}
            />
          </div>

          <div className="post-right">
            <div className="post-header">{post.user === "me" ? currentProfileName : post.user}</div>
            <p className="post-caption">{post.caption}</p>
            {post.image && <img className="post-image" src={`/posts/${post.image}`} alt="Post" />}
            <div className="post-footer">
              <ChatBubbleOutlineOutlinedIcon className="icon comment" onClick={() => handleCommentClick(index)} />
                {post.liked ? (
                  <FavoriteIcon className="icon heart hearted" onClick={() => handleLikeClick(index)} />
                ) : (
                  <FavoriteBorderOutlinedIcon className="icon heart" onClick={() => handleLikeClick(index)} />
                )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}