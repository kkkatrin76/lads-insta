// Render one preview card.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { getDisplayImage, getDisplayName } from "../engine/userDisplay";

export default function PostCard({ post, scene, profileName, profileImage, onLikeChange }) {
  const currentProfileName = profileName || "You";
  const currentProfileImage = profileImage || "./icons/you.png";
  const [liked, setLiked] = useState(Boolean(post?.liked));

  useEffect(() => {
    setLiked(Boolean(post?.liked));
  }, [post?.id, post?.liked]);

  const playInteractionSound = () => {
    if (typeof window === "undefined") {
      return;
    }

    const audio = new Audio("./sfx/lad_interact_with_him.mp3");
    audio.volume = 0.7;
    audio.play().catch(() => {});
  };

  const handleLikeClick = () => {
    playInteractionSound();

    const nextLiked = !liked;
    setLiked(nextLiked);

    if (typeof onLikeChange === "function") {
      onLikeChange(post.id, nextLiked);
    }
  };

  const displayName = post.user === "me" ? currentProfileName : getDisplayName(post.user, post.user);
  const displayImage = post.user === "me" ? currentProfileImage : getDisplayImage(post.user);

  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "start", gap: 12, borderBottom: "solid 1px #bebebe" }}>
      {/* Left side: pfp */}
      <div className="post-left">
        <img
          className="post-pfp"
          src={displayImage}
          alt={displayName}
        />
      </div>

      {/* Right side: post content & action buttons */}
      <div className="post-right">
        <div className="post-header">{displayName}</div>
        <p className="post-caption">{post.caption}</p>
        {post.image && <img className="post-image" src={`./posts/${post.image}`} alt="Post" />}
        <div className="post-footer">
          <Link
            to={`/post/${post.id}`}
            state={{ fromScene: scene }}
            onClick={() => {
              playInteractionSound();

              if (typeof window !== "undefined") {
                window.sessionStorage.setItem(`scene-scroll-${scene}`, String(window.scrollY));
              }
            }}
            style={{
              textDecoration: "none",
              color: "inherit"
            }}
          ><ChatBubbleOutlineOutlinedIcon className="icon comment" /></Link>
          
            {liked ? (
              <FavoriteIcon className="icon heart hearted" onClick={() => handleLikeClick()} />
            ) : (
              <FavoriteBorderOutlinedIcon className="icon heart" onClick={() => handleLikeClick()} />
            )}
        </div>
      </div>
    </div>
  );
}