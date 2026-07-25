import { useEffect, useState } from "react";
import { HashRouter, Navigate, Routes, Route } from "react-router-dom";

import ScenePage from "./pages/ScenePage";
import PostPage from "./pages/PostPage";
import SettingPage from "./pages/SettingPage";

const DISCLAIMER_SESSION_KEY = "disclaimer-seen";

function NotificationHost() {
  const [notifications, setNotifications] = useState([]);
  const [showDisclaimer, setShowDisclaimer] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.sessionStorage.getItem(DISCLAIMER_SESSION_KEY) !== "true";
  });

  const playToastSound = () => {
    if (typeof window === "undefined") {
      return;
    }

    const audio = new Audio("./sfx/lad_message_tone.mp3");
    audio.volume = 0.7;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    const handleNotify = (event) => {
      const notification = event.detail;

      if (!notification?.text) {
        return;
      }

      setNotifications((current) => {
        if (current.some((item) => item.id === notification.id)) {
          return current;
        }

        playToastSound();
        return [...current, notification];
      });

      window.setTimeout(() => {
        setNotifications((current) => current.filter((item) => item.id !== notification.id));
      }, 5000);
    };

    window.addEventListener("app:notify", handleNotify);

    return () => {
      window.removeEventListener("app:notify", handleNotify);
    };
  }, []);

  const dismissNotification = (notificationId) => {
    setNotifications((current) => current.filter((item) => item.id !== notificationId));
  };

  const dismissDisclaimer = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(DISCLAIMER_SESSION_KEY, "true");
    }

    setShowDisclaimer(false);
  };

  return (
    <>
      {showDisclaimer && (
        <div className="disclaimer-overlay" role="presentation">
          <div className="disclaimer-modal" role="dialog" aria-modal="true" aria-labelledby="disclaimer-title">
            <h1 id="disclaimer-title" className="disclaimer-title">⚠️ DISCLAIMER ⚠️</h1>
            <p className="disclaimer-body">This is purely a fan project that has no affiliations with Infold, Papergames or any related parties. Please do not disseminate, repost, link, or share outside your friends group without my permission, especially with the knowledge of the current situation following Valko's cancellation.</p>
            <button type="button" className="disclaimer-button" onClick={dismissDisclaimer}>
              I understand
            </button>
          </div>
        </div>
      )}

      <div className="notification-stack">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-toast">
            <span>{notification.text}</span>
            <button type="button" className="notification-close" onClick={() => dismissNotification(notification.id)} aria-label="Close notification">
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="version">V1.0.6</div>

      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/r/testflight" replace />} />
          <Route path="/r/:scene" element={<ScenePage />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="/settings" element={<SettingPage />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default function App() {
  return <NotificationHost />;
}