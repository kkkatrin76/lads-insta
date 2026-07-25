import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Post from "../components/Post";
import { playBackButtonSound } from "../utils/sounds";
import { scenes } from "../data/scenes";

import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

const postModules = import.meta.glob("../data/posts/*.js");

function normalizePost(post, fallbackId) {
  return {
    ...post,
    id: post?.id ?? fallbackId,
  };
}

export default function PostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const fromScene = location.state?.fromScene;

  function readSavedGameState() {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const savedGameState = window.localStorage.getItem("game-state");

      if (!savedGameState) {
        return null;
      }

      return JSON.parse(savedGameState);
    } catch {
      return null;
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    let isMounted = true;

    const loadPost = async () => {
      const savedGameState = readSavedGameState();
      const sceneName = fromScene ?? location.state?.fromScene;

      if (sceneName) {
        const addedScenePosts = Array.isArray(savedGameState?.scenePosts?.[sceneName])
          ? savedGameState.scenePosts[sceneName].map((candidate, index) =>
              normalizePost(candidate, `saved-${index}`)
            )
          : [];
        const existingAddedPost = addedScenePosts.find((candidate) => candidate.id === postId);

        if (existingAddedPost && isMounted) {
          setPost(existingAddedPost);
          return;
        }
      }

      for (const moduleLoader of Object.values(postModules)) {
        const module = await moduleLoader();
        const normalizedPosts = Object.entries(module.posts ?? {}).map(([postKey, candidate]) =>
          normalizePost(candidate, postKey)
        );
        const match = normalizedPosts.find((candidate) => candidate.id === postId);

        if (match) {
          if (isMounted) {
            setPost(match);
          }
          return;
        }
      }

      if (isMounted) {
        setPost(null);
      }
    };

    loadPost();

    return () => {
      isMounted = false;
    };
  }, [fromScene, location.state?.fromScene, postId]);

  const handleBackClick = () => {
    playBackButtonSound();

    if (fromScene) {
      navigate(`/r/${fromScene}`, { replace: true });
      return;
    }
    navigate(-1);
  };

  if (!post) {
    return (
    <div className="app-shell">
      <main className="main-content">
        <div className="feed">
          <p>Post not found.</p>
        </div>
      </main>
    </div>
  );
  }

  return (
    <div className="app-shell">
      <main className="main-content">
        <div className="feed">
          <button type="button" className="post-back-button" onClick={handleBackClick}><ArrowBackIosNewOutlinedIcon /></button>
          <Post post={post} scene={fromScene} />
        </div>
      </main>
    </div>
  );
}