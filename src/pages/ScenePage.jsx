import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { scenes } from "../data/scenes";
import { usrids } from "../data/users";
import { initialState } from "../engine/GameState";
import PostCard from "../components/PostCard";

import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

const sceneModules = import.meta.glob("../data/posts/*.js");

function normalizePost(post, fallbackId) {
  return {
    ...post,
    id: post?.id ?? fallbackId,
  };
}

function mergeScenePosts(basePosts, savedScenePosts) {
  const savedPosts = Array.isArray(savedScenePosts) ? savedScenePosts : [];
  const normalizedSavedPosts = savedPosts.map((post, index) =>
    normalizePost(post, `saved-${index}`)
  );
  const savedById = new Map(normalizedSavedPosts.map((post) => [post.id, post]));

  const mergedBasePosts = basePosts.map((post) => {
    const savedPost = savedById.get(post.id);

    return savedPost ? { ...post, ...savedPost } : post;
  });

  const extraSavedPosts = normalizedSavedPosts.filter(
    (savedPost) => !basePosts.some((basePost) => basePost.id === savedPost.id),
  );

  return [...extraSavedPosts, ...mergedBasePosts];
}

function readSavedGameState() {
  if (typeof window === "undefined") {
    return initialState;
  }

  try {
    const savedGameState = window.localStorage.getItem("game-state");

    if (!savedGameState) {
      return initialState;
    }

    const parsedState = JSON.parse(savedGameState);

    return {
      ...initialState,
      ...parsedState,
      playerProfile: {
        ...initialState.playerProfile,
        ...(parsedState.playerProfile ?? {}),
      },
      customUsernames: {
        ...(initialState.customUsernames ?? {}),
        ...(parsedState.customUsernames ?? {}),
      },
    };
  } catch {
    return initialState;
  }
}

export default function ScenePage() {
  const { scene } = useParams();
  const navigate = useNavigate();
  const data = scenes[scene];
  const fileInputRef = useRef(null);
  const [scenePosts, setScenePosts] = useState([]);
  const [gameState, setGameState] = useState(readSavedGameState);
  const [profileName, setProfileName] = useState(
    () => readSavedGameState().playerProfile?.name || "You",
  );
  const [profileImage, setProfileImage] = useState(
    () => readSavedGameState().playerProfile?.image || "./icons/you.png",
  );
  const [customUsernames, setCustomUsernames] = useState(
    () => readSavedGameState().customUsernames ?? {},
  );

  useEffect(() => {
    if (!data) {
      setScenePosts([]);
      return;
    }

    const loadScenePosts = async () => {
      const modulePath = `../data/posts/${data.postsPath}`;
      const moduleLoader = sceneModules[modulePath];

      if (!moduleLoader) {
        setScenePosts([]);
        return;
      }

      const sceneModule = await moduleLoader();
      const basePosts = Object.entries(sceneModule.posts ?? {}).map(([postKey, post]) =>
        normalizePost(post, postKey)
      );
      const savedScenePosts = Array.isArray(gameState.scenePosts?.[scene])
        ? gameState.scenePosts[scene]
        : [];

      setScenePosts(mergeScenePosts(basePosts, savedScenePosts));
    };

    loadScenePosts();
  }, [data, scene, gameState.scenePosts]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setGameState((prevState) => {
      const nextGameState = {
        ...prevState,
        playerProfile: {
          name: profileName,
          image: profileImage,
        },
        customUsernames,
      };

      window.localStorage.setItem("game-state", JSON.stringify(nextGameState));
      window.localStorage.setItem("dashboard-name", profileName);
      window.localStorage.setItem("user-pfp", profileImage);
      return nextGameState;
    });
  }, [profileName, profileImage, customUsernames]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.history.scrollRestoration = "manual";

    const scrollKey = `scene-scroll-${scene}`;
    const savedScroll = Number(window.sessionStorage.getItem(scrollKey) || 0);

    const handleScroll = () => {
      window.sessionStorage.setItem(scrollKey, String(window.scrollY));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.history.scrollRestoration = "auto";
    };
  }, [scene]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const scrollKey = `scene-scroll-${scene}`;
    const savedScroll = Number(window.sessionStorage.getItem(scrollKey) || 0);

    if (scenePosts.length > 0 && savedScroll > 0) {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: savedScroll, behavior: "auto" });
      });
    }
  }, [scene, scenePosts.length]);

  const handleNameClick = () => {
    if (typeof window === "undefined") {
      return;
    }

    const nextName = window.prompt("Enter your name", profileName);

    if (nextName !== null) {
      setProfileName(nextName.trim() || "You");
    }
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      window.alert("Please choose an image smaller than 2MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(String(reader.result));
      event.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  const handleLikeChange = (postId, liked) => {
    if (typeof window === "undefined") {
      return;
    }

    const savedGameState = window.localStorage.getItem("game-state");
    if (!savedGameState) {
      return;
    }

    const parsedGameState = JSON.parse(savedGameState);
    const currentScenePosts = Array.isArray(scenePosts) ? scenePosts : [];

    const nextScenePosts = currentScenePosts.map((candidatePost) => {
      if (candidatePost.id !== postId) {
        return candidatePost;
      }

      return {
        ...candidatePost,
        liked,
      };
    });

    const nextGameState = {
      ...parsedGameState,
      scenePosts: {
        ...(parsedGameState.scenePosts ?? {}),
        [scene]: nextScenePosts,
      },
    };

    window.localStorage.setItem("game-state", JSON.stringify(nextGameState));
    setGameState(nextGameState);
  };

  const playToolbarSound = (soundPath) => {
    if (typeof window === "undefined") {
      return;
    }

    const audio = new Audio(soundPath);
    audio.volume = 0.7;
    audio.play().catch(() => {});
  };

  const handleHardReset = () => {
    playToolbarSound("/sfx/lad_select.mp3");

    if (typeof window === "undefined") {
      return;
    }

    const shouldReset = window.confirm("⚠️ WARNING: This will clear your browser's local storage, username settings, and posts. Are you sure you want to do this?");

    if (!shouldReset) {
      return;
    }

    refreshScene();
    window.localStorage.clear();
    window.location.reload();
  };

  const handleRefreshScene = () => {
    playToolbarSound("/sfx/lad_select.mp3");

    if (typeof window === "undefined") {
      return;
    }

    const shouldRefresh = window.confirm("This will reset this page back to its original posts. Are you sure you want to do this?");

    if (!shouldRefresh) {
      return;
    }

    refreshScene();
  };

  const refreshScene = () => {
    const savedGameState = window.localStorage.getItem("game-state");

    if (!savedGameState) {
      return;
    }

    const parsedGameState = JSON.parse(savedGameState);
    const nextGameState = {
      ...parsedGameState,
      scenePosts: {
        ...(parsedGameState.scenePosts ?? {}),
        [scene]: [],
      },
    };

    window.localStorage.setItem("game-state", JSON.stringify(nextGameState));
    setGameState(nextGameState);
  };

  if (!data) {
    return null;
  }

  return (
    <div className="app-shell">
      <main className="main-content">

        <div className="top">
          <div className="scene-toolbar">
            {/* Refresh button to reset the scene posts to the original state */}
            <button type="button" className="scene-toolbar-button" onClick={handleHardReset} >
              <DeleteSweepIcon />
            </button>
            {/* Refresh button to reset the scene posts to the original state */}
            <button type="button" className="scene-toolbar-button" onClick={handleRefreshScene} >
              <RefreshOutlinedIcon />
            </button>
            {/* Setting button to set account names */}
            <button type="button" className="scene-toolbar-button" onClick={() => {
              playToolbarSound("/sfx/lad_select.mp3");
              navigate("/settings");
            }} >
              <ManageAccountsOutlinedIcon />
            </button>
            
          </div>

          {/* Profile image & name */}
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleProfileImageChange}/>
          
          <div className="my-toolbar">
            <span className="name-button" onClick={handleNameClick}>
              {profileName}
            </span>
            <img className="user-pfp scene-profile-image" src={profileImage} alt="Your pfp" onClick={handleProfileImageClick}/>
          </div>
        </div>

        <div className="feed">
          {scenePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              scene={scene}
              profileName={profileName}
              profileImage={profileImage}
              onLikeChange={handleLikeChange}
            />
          ))}
        </div>

      </main>
    </div>
  );
}