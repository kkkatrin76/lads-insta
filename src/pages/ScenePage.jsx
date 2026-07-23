import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { scenes } from "../data/scenes";
import { initialState } from "../engine/GameState";
import PostCard from "../components/PostCard";

import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

const sceneModules = import.meta.glob("../data/posts/*.js");

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
    };
  } catch {
    return initialState;
  }
}

export default function ScenePage() {
  const { scene } = useParams();
  const data = scenes[scene];
  const fileInputRef = useRef(null);
  const [scenePosts, setScenePosts] = useState([]);
  const [gameState, setGameState] = useState(readSavedGameState);
  const [profileName, setProfileName] = useState(
    () => readSavedGameState().playerProfile?.name || "You",
  );
  const [profileImage, setProfileImage] = useState(
    () => readSavedGameState().playerProfile?.image || "/icons/you.png",
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
      const basePosts = Object.values(sceneModule.posts ?? {});
      const addedScenePosts = Array.isArray(gameState.scenePosts?.[scene])
        ? gameState.scenePosts[scene]
        : [];

      setScenePosts([...addedScenePosts, ...basePosts]);
    };

    loadScenePosts();
  }, [data, scene, gameState.scenePosts]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const nextGameState = {
      ...gameState,
      playerProfile: {
        name: profileName,
        image: profileImage,
      },
    };

    setGameState(nextGameState);
    window.localStorage.setItem("game-state", JSON.stringify(nextGameState));
    window.localStorage.setItem("dashboard-name", profileName);
    window.localStorage.setItem("user-pfp", profileImage);
  }, [profileName, profileImage]);

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

  const handleRefreshScene = () => {
    if (typeof window === "undefined") {
      return;
    }

    const shouldRefresh = window.confirm("This will reset this feed back to its original posts. Are you sure you want to do this?");

    if (!shouldRefresh) {
      return;
    }

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

  // TODO: Implement a feature to customize the usernames of the boys
  const handleCustomizeUsernames = () => {
    if (typeof window === "undefined") {
      return;
    }
  };

  if (!data) {
    return null;
  }

  return (
    <div className="app-shell">
      <main className="main-content">
        {/* Profile image & name */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleProfileImageChange}
        />

        <div className="topbar">
          <span className="name-button" onClick={handleNameClick}>
            {profileName}
          </span>
          <img
            className="user-pfp scene-profile-image"
            src={profileImage}
            alt="your profile"
            onClick={handleProfileImageClick}
          />
        </div>

        {/* Refresh button to reset the scene posts to the original state */}
        <div className="scene-toolbar">
          {/* Refresh button to reset the scene posts to the original state */}
          <button
            type="button"
            className="scene-refresh-button"
            onClick={handleRefreshScene}
          >
            <RefreshOutlinedIcon />
          </button>
          {/* TODO: Customize button to customize your boys' usernames */}
          <button
            type="button"
            className="scene-refresh-button"
            onClick={handleCustomizeUsernames}
          >
            <ManageAccountsOutlinedIcon />
          </button>
        </div>

        <div className="feed">
          {scenePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              scene={scene}
              profileName={profileName}
              profileImage={profileImage}
            />
          ))}
        </div>
      </main>
    </div>
  );
}