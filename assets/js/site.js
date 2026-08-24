/* Kanghe Lyu site — shared cross-page runtime */
(function () {
  "use strict";

  const LANG_STATE_KEY = "kanghe-site-lang";
  const MUSIC_STATE_KEY = "kanghe-site-music-state";
  const musicList = Array.from({ length: 41 }, (_, index) => `music/music${index + 1}.mp3`);

  const safeStorage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch (_) { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); } catch (_) { /* storage can be disabled */ }
    }
  };

  let currentLang = safeStorage.get(LANG_STATE_KEY) || "en";
  let pageLanguageApplier = null;
  const toggleBtn = document.getElementById("lang-toggle");
  const audio = document.getElementById("bg-music");
  const musicBtn = document.getElementById("music-toggle");
  const prevTrackBtn = document.getElementById("prev-track");
  const nextTrackBtn = document.getElementById("next-track");
  const playlistPanel = document.getElementById("playlist-panel");
  const playlistToggle = document.getElementById("playlist-toggle");
  const playlistList = document.getElementById("playlist-list");

  let isMusicPlaying = false;
  let currentTrackIndex = -1;
  let saveTimer = 0;

  function getMusicButtonText() {
    if (currentLang === "zh") return isMusicPlaying ? "♪ 播放中" : "♪ 音乐";
    return isMusicPlaying ? "♪ Playing" : "♪ Music";
  }

  function getPlaylistToggleText() {
    const collapsed = !playlistPanel || playlistPanel.classList.contains("collapsed");
    if (currentLang === "zh") return collapsed ? "播放列表 ▾" : "播放列表 ▴";
    return collapsed ? "Playlist ▾" : "Playlist ▴";
  }

  function updateMusicButton() {
    if (!musicBtn) return;
    musicBtn.textContent = getMusicButtonText();
    musicBtn.classList.toggle("playing", isMusicPlaying);
    musicBtn.setAttribute("aria-pressed", String(isMusicPlaying));
    musicBtn.setAttribute("aria-label", isMusicPlaying ? "Pause background music" : "Play background music");
  }

  function getTrackName(index) {
    return currentLang === "zh" ? `第 ${index + 1} 首` : `Track ${index + 1}`;
  }

  function updatePlaylistUI() {
    if (!playlistList || !playlistToggle || !playlistPanel) return;
    playlistToggle.textContent = getPlaylistToggleText();
    playlistToggle.setAttribute("aria-expanded", String(!playlistPanel.classList.contains("collapsed")));
    playlistList.querySelectorAll(".playlist-item").forEach((item, index) => {
      item.textContent = getTrackName(index);
      item.classList.toggle("active", index === currentTrackIndex);
      if (index === currentTrackIndex) item.setAttribute("aria-current", "true");
      else item.removeAttribute("aria-current");
    });
  }

  function buildPlaylist() {
    if (!playlistList) return;
    playlistList.replaceChildren();
    musicList.forEach((_, index) => {
      const item = document.createElement("button");
      item.className = "playlist-item";
      item.type = "button";
      item.dataset.index = String(index);
      item.setAttribute("role", "listitem");
      item.textContent = getTrackName(index);
      item.addEventListener("click", async () => {
        try { await playTrack(index, 0); } catch (error) { console.info("Track playback was blocked:", error); }
      });
      playlistList.appendChild(item);
    });
    updatePlaylistUI();
  }

  function readMusicState() {
    const raw = safeStorage.get(MUSIC_STATE_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (_) { return null; }
  }

  function saveMusicState() {
    if (!audio) return;
    safeStorage.set(MUSIC_STATE_KEY, JSON.stringify({
      isPlaying: isMusicPlaying,
      trackIndex: currentTrackIndex,
      currentTime: audio.currentTime || 0,
      volume: audio.volume || 0.42,
      savedAt: Date.now()
    }));
  }

  function scheduleSaveMusicState() {
    if (saveTimer || !audio) return;
    saveTimer = window.setTimeout(() => {
      saveTimer = 0;
      saveMusicState();
    }, 1000);
  }

  function validTrackIndex(index) {
    return Number.isInteger(index) && index >= 0 && index < musicList.length;
  }

  function getRandomTrackIndex() {
    if (musicList.length < 2) return 0;
    let nextIndex = currentTrackIndex;
    while (nextIndex === currentTrackIndex) nextIndex = Math.floor(Math.random() * musicList.length);
    return nextIndex;
  }

  async function playTrack(trackIndex, startTime) {
    if (!audio || !validTrackIndex(trackIndex)) return;
    currentTrackIndex = trackIndex;
    audio.src = musicList[currentTrackIndex];
    audio.volume = 0.42;
    audio.addEventListener("loadedmetadata", () => {
      if (startTime > 0 && startTime < audio.duration) audio.currentTime = startTime;
    }, { once: true });
    await audio.play();
    isMusicPlaying = true;
    updateMusicButton();
    updatePlaylistUI();
    saveMusicState();
  }

  async function playNextTrack() {
    const nextIndex = currentTrackIndex < 0 ? getRandomTrackIndex() : (currentTrackIndex + 1) % musicList.length;
    await playTrack(nextIndex, 0);
  }

  async function playPreviousTrack() {
    const previousIndex = currentTrackIndex < 0 ? getRandomTrackIndex() : (currentTrackIndex - 1 + musicList.length) % musicList.length;
    await playTrack(previousIndex, 0);
  }

  async function restoreMusicFromPreviousPage() {
    if (!audio) return;
    const state = readMusicState();
    if (!state || !validTrackIndex(state.trackIndex)) {
      updateMusicButton();
      return;
    }
    currentTrackIndex = state.trackIndex;
    audio.src = musicList[currentTrackIndex];
    audio.volume = state.volume || 0.42;
    if (!state.isPlaying) {
      updateMusicButton();
      updatePlaylistUI();
      return;
    }
    const elapsed = Math.max(0, (Date.now() - (state.savedAt || Date.now())) / 1000);
    const restoredTime = Math.max(0, (state.currentTime || 0) + elapsed);
    try {
      await playTrack(currentTrackIndex, restoredTime);
    } catch (error) {
      isMusicPlaying = false;
      updateMusicButton();
      updatePlaylistUI();
      console.info("Music restore was blocked:", error);
    }
  }

  if (musicBtn && audio) {
    musicBtn.addEventListener("click", async () => {
      try {
        if (isMusicPlaying) {
          audio.pause();
          isMusicPlaying = false;
          updateMusicButton();
          saveMusicState();
          return;
        }
        const state = readMusicState();
        await playTrack(validTrackIndex(state && state.trackIndex) ? state.trackIndex : getRandomTrackIndex(), state ? state.currentTime || 0 : 0);
      } catch (error) { console.info("Music playback was blocked:", error); }
    });
  }

  if (prevTrackBtn && audio) prevTrackBtn.addEventListener("click", () => playPreviousTrack().catch((error) => console.info("Previous track was blocked:", error)));
  if (nextTrackBtn && audio) nextTrackBtn.addEventListener("click", () => playNextTrack().catch((error) => console.info("Next track was blocked:", error)));
  if (playlistToggle && playlistPanel) {
    playlistToggle.addEventListener("click", () => {
      playlistPanel.classList.toggle("collapsed");
      updatePlaylistUI();
    });
  }
  if (audio) {
    audio.addEventListener("timeupdate", () => { if (isMusicPlaying) scheduleSaveMusicState(); });
    audio.addEventListener("pause", () => { if (!audio.ended) saveMusicState(); });
    audio.addEventListener("ended", () => { if (isMusicPlaying) playNextTrack().catch((error) => console.info("Next track was blocked:", error)); });
    window.addEventListener("beforeunload", saveMusicState);
  }

  function applyLanguage(lang) {
    currentLang = lang === "zh" ? "zh" : "en";
    safeStorage.set(LANG_STATE_KEY, currentLang);
    document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
    if (pageLanguageApplier) pageLanguageApplier(currentLang);
    if (toggleBtn) {
      toggleBtn.textContent = currentLang === "en" ? "EN / 中文" : "中文 / EN";
      toggleBtn.setAttribute("aria-pressed", String(currentLang === "zh"));
      toggleBtn.setAttribute("aria-label", currentLang === "en" ? "Switch to Chinese" : "切换到英文");
    }
    updateMusicButton();
    updatePlaylistUI();
  }

  if (toggleBtn) toggleBtn.addEventListener("click", () => applyLanguage(currentLang === "en" ? "zh" : "en"));

  window.KangheSite = {
    get lang() { return currentLang; },
    init(applier) {
      pageLanguageApplier = typeof applier === "function" ? applier : null;
      applyLanguage(currentLang);
      buildPlaylist();
      restoreMusicFromPreviousPage();
    }
  };
})();
