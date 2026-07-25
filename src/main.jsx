import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { playSelectSound } from './utils/sounds';

const isInteractiveElement = (element) => {
  if (!element) {
    return false;
  }

  if (element.closest('.post-back-button') || element.closest('.icon')) {
    return false;
  }

  return Boolean(
    element.closest(
      'button, a, [role="button"], .name-button, .user-pfp, .icon, .reply-option-button, .reply-submit-button, .scene-toolbar-button, .settings-submit-button'
    )
  );
};

document.addEventListener('click', (event) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  if (target.closest('input, textarea, select')) {
    return;
  }

  if (isInteractiveElement(target)) {
    playSelectSound();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
