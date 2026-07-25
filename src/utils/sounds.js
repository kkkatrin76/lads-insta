function getAssetUrl(path) {
  const normalizedPath = path
    .replace(/^\.\//, "")
    .replace(/^\//, "");
  const basePath = import.meta.env.BASE_URL || '/';

  return `${basePath}${normalizedPath}`.replace(/([^:]\/)\//g, '$1');
}

const audioCache = new Map();

function createAudio(path, volume = 0.7) {
  const audio = new Audio(getAssetUrl(path));
  audio.volume = volume;
  audio.preload = "auto";
  audio.load();
  return audio;
}

function getCachedAudio(path, volume = 0.7) {
  const cacheKey = `${path}|${volume}`;
  const cachedAudio = audioCache.get(cacheKey);

  if (cachedAudio) {
    cachedAudio.volume = volume;
    return cachedAudio;
  }

  const audio = createAudio(path, volume);
  audioCache.set(cacheKey, audio);
  return audio;
}

function playAudio(path, volume = 0.7) {
  if (typeof window === "undefined") {
    return;
  }

  const audio = getCachedAudio(path, volume);

  try {
    audio.pause();
    audio.currentTime = 0;
  } catch {
    // Ignore browsers that block resetting before metadata is ready.
  }

  audio.play().catch(() => {});
}

export function unlockAudio() {
  if (typeof window === "undefined") {
    return;
  }

  const unlockSounds = [
    ["./sfx/lad_back.mp3", 0],
    ["./sfx/lad_select.mp3", 0],
    ["./sfx/lad_message_tone.mp3", 0],
    ["./sfx/lad_bubble_sound.mp3", 0],
    ["./sfx/lad_interact_with_him.mp3", 0],
  ];

  unlockSounds.forEach(([path, volume]) => {
    const audio = getCachedAudio(path, volume);
    audio.muted = true;

    try {
      audio.pause();
      audio.currentTime = 0;
    } catch {
      // Ignore reset failures during initial unlock.
    }

    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;
    }).catch(() => {});
  });
}

export function playBubbleSound() {
  playAudio("./sfx/lad_bubble_sound.mp3", 0.6);
}

export function playMessageTone() {
  playAudio("./sfx/lad_message_tone.mp3", 0.7);
}

export function playBackButtonSound() {
  playAudio("./sfx/lad_back.mp3", 0.6);
}

export function playSelectSound() {
  playAudio("./sfx/lad_select.mp3", 0.7);
}
