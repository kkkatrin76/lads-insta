export function playBackButtonSound() {
  if (typeof window === "undefined") {
    return;
  }

  const audio = new Audio("/sfx/lad_back.mp3");
  audio.volume = 0.6;
  audio.play().catch(() => {});
}

export function playSelectSound() {
  if (typeof window === "undefined") {
    return;
  }

  const audio = new Audio("/sfx/lad_select.mp3");
  audio.volume = 0.7;
  audio.play().catch(() => {});
}
