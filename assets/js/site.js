/* ============================================================
   Kanghe Lyu site — site.js
   Shared cross-page runtime, loaded before the page script:
     - kanghe-site-lang         language state + toggle
     - kanghe-site-music-state  music state + player widgets
   Each page calls KangheSite.init(applyPageLanguage).
   ============================================================ */

(function () {
  "use strict";

  const LANG_STATE_KEY = "kanghe-site-lang";
  const MUSIC_STATE_KEY = "kanghe-site-music-state";

  let currentLang = localStorage.getItem(LANG_STATE_KEY) || "en";
  let pageLanguageApplier = null;
  const toggleBtn = document.getElementById("lang-toggle");

  // ============== Background music with cross-page state ==============
  const musicList = [
    "music/music1.mp3",
    "music/music2.mp3",
    "music/music3.mp3",
    "music/music4.mp3",
    "music/music5.mp3",
    "music/music6.mp3",
    "music/music7.mp3",
    "music/music8.mp3",
    "music/music9.mp3",
    "music/music10.mp3",
    "music/music11.mp3",
    "music/music12.mp3",
    "music/music13.mp3",
    "music/music14.mp3",
    "music/music15.mp3",
    "music/music16.mp3",
    "music/music17.mp3",
    "music/music18.mp3",
    "music/music19.mp3",
    "music/music20.mp3",
    "music/music21.mp3",
    "music/music22.mp3",
    "music/music23.mp3",
    "music/music24.mp3",
    "music/music25.mp3",
    "music/music26.mp3",
    "music/music27.mp3",
    "music/music28.mp3",
    "music/music29.mp3",
    "music/music30.mp3",
    "music/music31.mp3",
    "music/music32.mp3",
    "music/music33.mp3",
    "music/music34.mp3",
    "music/music35.mp3",
    "music/music36.mp3",
    "music/music37.mp3",
    "music/music38.mp3",
    "music/music39.mp3",
    "music/music40.mp3",
    "music/music41.mp3"
  ];

  const audio = document.getElementById("bg-music");
  const musicBtn = document.getElementById("music-toggle");
  const prevTrackBtn = document.getElementById("prev-track");
  const nextTrackBtn = document.getElementById("next-track");
  const playlistPanel = document.getElementById("playlist-panel");
  const playlistToggle = document.getElementById("playlist-toggle");
  const playlistList = document.getElementById("playlist-list");

  let isMusicPlaying = false;
  let currentTrackIndex = -1;

  function getMusicButtonText() {
  if (currentLang === "zh") {
  return isMusicPlaying ? "♪ 播放中" : "♪ 音乐";
  }
  return isMusicPlaying ? "♪ Playing" : "♪ Music";
  }

  function getPlaylistToggleText() {
  const isCollapsed = playlistPanel.classList.contains("collapsed");

  if (currentLang === "zh") {
  return isCollapsed ? "播放列表 ▾" : "播放列表 ▴";
  }

  return isCollapsed ? "Playlist ▾" : "Playlist ▴";
  }

  function updateMusicButton() {
  if (!musicBtn) return;

  musicBtn.textContent = getMusicButtonText();

  if (isMusicPlaying) {
  musicBtn.classList.add("playing");
  } else {
  musicBtn.classList.remove("playing");
  }

  updatePlaylistUI();
  }

  function getTrackName(index) {
  if (currentLang === "zh") {
  return `第 ${index + 1} 首`;
  }

  return `Track ${index + 1}`;
  }

  function buildPlaylist() {
  playlistList.innerHTML = "";

  musicList.forEach((src, index) => {
  const item = document.createElement("button");
  item.className = "playlist-item";
  item.type = "button";
  item.dataset.index = index;
  item.textContent = getTrackName(index);

  item.addEventListener("click", async () => {
  try {
  await playTrack(index, 0);
  } catch (error) {
  console.log("Playlist track playback was blocked by the browser:", error);
  }
  });

  playlistList.appendChild(item);
  });

  updatePlaylistUI();
  }

  function updatePlaylistUI() {
  if (!playlistList || !playlistToggle || !playlistPanel) return;

  playlistToggle.textContent = getPlaylistToggleText();

  const items = playlistList.querySelectorAll(".playlist-item");

  items.forEach((item, index) => {
  item.textContent = getTrackName(index);

  if (index === currentTrackIndex) {
  item.classList.add("active");
  } else {
  item.classList.remove("active");
  }
  });
  }

  function saveMusicState() {
  const state = {
  isPlaying: isMusicPlaying,
  trackIndex: currentTrackIndex,
  currentTime: audio.currentTime || 0,
  volume: audio.volume || 0.42,
  savedAt: Date.now()
  };

  localStorage.setItem(MUSIC_STATE_KEY, JSON.stringify(state));
  }

  function loadMusicState() {
  try {
  const raw = localStorage.getItem(MUSIC_STATE_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
  } catch (error) {
  console.log("Could not load music state:", error);
  return null;
  }
  }

  function getRandomTrackIndex() {
  if (musicList.length === 1) return 0;

  let nextIndex;

  do {
  nextIndex = Math.floor(Math.random() * musicList.length);
  } while (nextIndex === currentTrackIndex);

  return nextIndex;
  }

  async function playTrack(trackIndex, startTime = 0) {
  if (trackIndex < 0 || trackIndex >= musicList.length) return;

  currentTrackIndex = trackIndex;
  audio.src = musicList[currentTrackIndex];
  audio.volume = 0.42;

  audio.addEventListener(
  "loadedmetadata",
  () => {
  if (startTime > 0 && startTime < audio.duration) {
  audio.currentTime = startTime;
  }
  },
  { once: true }
  );

  await audio.play();

  isMusicPlaying = true;
  updateMusicButton();
  saveMusicState();
  }

  async function playRandomTrack() {
  const nextIndex = getRandomTrackIndex();
  await playTrack(nextIndex, 0);
  }

  async function playNextTrack() {
  const nextIndex =
  currentTrackIndex < 0
  ? getRandomTrackIndex()
  : (currentTrackIndex + 1) % musicList.length;

  await playTrack(nextIndex, 0);
  }

  async function playPreviousTrack() {
  const prevIndex =
  currentTrackIndex < 0
  ? getRandomTrackIndex()
  : (currentTrackIndex - 1 + musicList.length) % musicList.length;

  await playTrack(prevIndex, 0);
  }

  async function restoreMusicFromPreviousPage() {
  const state = loadMusicState();

  if (!state || !state.isPlaying) {
  isMusicPlaying = false;

  if (
  state &&
  typeof state.trackIndex === "number" &&
  state.trackIndex >= 0 &&
  state.trackIndex < musicList.length
  ) {
  currentTrackIndex = state.trackIndex;
  audio.src = musicList[currentTrackIndex];
  audio.volume = state.volume || 0.42;
  }

  updateMusicButton();
  return;
  }

  if (
  typeof state.trackIndex !== "number" ||
  state.trackIndex < 0 ||
  state.trackIndex >= musicList.length
  ) {
  isMusicPlaying = false;
  updateMusicButton();
  return;
  }

  const elapsedSeconds = (Date.now() - state.savedAt) / 1000;
  const restoredTime = Math.max(0, (state.currentTime || 0) + elapsedSeconds);

  try {
  await playTrack(state.trackIndex, restoredTime);
  } catch (error) {
  isMusicPlaying = false;
  currentTrackIndex = state.trackIndex;
  audio.src = musicList[currentTrackIndex];
  audio.volume = state.volume || 0.42;

  audio.addEventListener(
  "loadedmetadata",
  () => {
  if (restoredTime > 0 && restoredTime < audio.duration) {
  audio.currentTime = restoredTime;
  }
  },
  { once: true }
  );

  updateMusicButton();
  console.log("Music restore was blocked by the browser:", error);
  }
  }

  musicBtn.addEventListener("click", async () => {
  try {
  if (!isMusicPlaying) {
  const state = loadMusicState();

  if (
  state &&
  typeof state.trackIndex === "number" &&
  state.trackIndex >= 0 &&
  state.trackIndex < musicList.length
  ) {
  await playTrack(state.trackIndex, state.currentTime || 0);
  } else {
  await playRandomTrack();
  }
  } else {
  audio.pause();
  isMusicPlaying = false;
  updateMusicButton();
  saveMusicState();
  }
  } catch (error) {
  console.log("Music playback was blocked by the browser:", error);
  }
  });

  prevTrackBtn.addEventListener("click", async () => {
  try {
  await playPreviousTrack();
  } catch (error) {
  console.log("Previous track playback was blocked by the browser:", error);
  }
  });

  nextTrackBtn.addEventListener("click", async () => {
  try {
  await playNextTrack();
  } catch (error) {
  console.log("Next track playback was blocked by the browser:", error);
  }
  });

  playlistToggle.addEventListener("click", () => {
  playlistPanel.classList.toggle("collapsed");
  updatePlaylistUI();
  });

  audio.addEventListener("timeupdate", () => {
  if (isMusicPlaying) saveMusicState();
  });

  audio.addEventListener("pause", () => {
  if (!audio.ended) saveMusicState();
  });

  audio.addEventListener("ended", async () => {
  if (isMusicPlaying) await playNextTrack();
  });

  window.addEventListener("beforeunload", saveMusicState);

  /* ---------- Public language bridge ---------- */

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_STATE_KEY, currentLang);
    document.documentElement.lang = currentLang === "en" ? "en" : "zh";

    if (pageLanguageApplier) {
      pageLanguageApplier(currentLang);
    }

    if (toggleBtn) {
      toggleBtn.textContent = currentLang === "en" ? "EN / 中文" : "中文 / EN";
    }

    updateMusicButton();
    updatePlaylistUI();
  }

  function switchLanguage() {
    applyLanguage(currentLang === "en" ? "zh" : "en");
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", switchLanguage);
  }

  window.KangheSite = {
    get lang() {
      return currentLang;
    },
    init: function (applier) {
      pageLanguageApplier = typeof applier === "function" ? applier : null;
      applyLanguage(currentLang);
      buildPlaylist();
      restoreMusicFromPreviousPage();
    }
  };
})();
