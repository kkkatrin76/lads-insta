import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usrids } from "../data/users";
import { initialState } from "../engine/GameState";
import { playBackButtonSound } from "../utils/sounds";

import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

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

export default function SettingPage() {
  const navigate = useNavigate();
  const savedState = readSavedGameState();
  const [profileName, setProfileName] = useState(savedState.playerProfile?.name || initialState.playerProfile.name);
  const [customUsernames, setCustomUsernames] = useState(savedState.customUsernames ?? {});
  const [statusMessage, setStatusMessage] = useState("");
  const [statusColor, setStatusColor] = useState("");

  const configurableUsers = [ "xavier", "zayne", "rafayel", "sylus", "caleb", "valko" ];
  const userEntries = Object.entries(usrids).filter(([userId]) => { 
    return configurableUsers.includes(userId);
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (typeof window === "undefined") {
      return;
    }

    const normalizedProfileName = profileName.trim();
    const normalizedCustomUsernames = Object.fromEntries(
      userEntries.map(([userId]) => [userId, String(customUsernames[userId] ?? "").trim()])
    );

    const hasEmptyValue = !normalizedProfileName || Object.values(normalizedCustomUsernames).some((value) => !value);

    if (hasEmptyValue) {
      setStatusMessage("All usernames should be filled in!");
      setStatusColor("#962e2e");
      return;
    }

    const nextState = {
      ...savedState,
      playerProfile: {
        ...savedState.playerProfile,
        name: normalizedProfileName,
        image: savedState.playerProfile?.image || initialState.playerProfile.image,
      },
      customUsernames: normalizedCustomUsernames,
    };

    window.localStorage.setItem("game-state", JSON.stringify(nextState));
    window.localStorage.setItem("dashboard-name", normalizedProfileName);
    setStatusMessage("Saved!");
    setStatusColor("#2f7a4f");
  };

  return (
    <div className="app-shell">
      <main className="main-content">
        <div className="feed">
          <button type="button" className="post-back-button" onClick={() => {
            playBackButtonSound();
            navigate(-1);
          }}><ArrowBackIosNewOutlinedIcon /></button>

          <p>Set everyone's display names.</p>

          <form onSubmit={handleSubmit} className="settings-form">
            <label className="settings-field">
              <span>Your name</span>
              <input
                type="text"
                value={profileName}
                onChange={(event) => {
                  setProfileName(event.target.value);
                  setStatusMessage("");
                }}
                placeholder="Enter your username"
              />
            </label>

            {userEntries.map(([userId, defaultName]) => (
              <label key={userId} className="settings-field">
                <span>{userId}</span>
                <input
                  type="text"
                  value={customUsernames[userId] ?? ""}
                  onChange={(event) => {
                    setCustomUsernames((current) => ({
                      ...current,
                      [userId]: event.target.value,
                    }));
                    setStatusMessage("");
                  }}
                  placeholder={`Enter username for ${defaultName}`}
                />
              </label>
            ))}

            <div className="settings-actions">
              {statusMessage && <p className="settings-status" style={{ color: statusColor }}>{statusMessage}</p>}
              <button type="submit" className="settings-submit-button"><SaveOutlinedIcon /></button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
