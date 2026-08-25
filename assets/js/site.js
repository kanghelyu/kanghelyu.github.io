/* Kanghe Lyu site — shared language and compact audio controls */
(function () {
  "use strict";

  const LANG_STATE_KEY = "kanghe-site-lang";
  const MUSIC_STATE_KEY = "kanghe-site-music-state";
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  const musicList = Array.from({ length: 41 }, (_, index) => `music/music${index + 1}.mp3`);

  const storage = {
    get(key) {
      try { return localStorage.getItem(key); } catch (_) { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch (_) { /* storage may be disabled */ }
    }
  };

  function ensureMediaDock() {
    let dock = document.querySelector(".media-dock");
    if (dock) return dock;

    const language = document.getElementById("lang-toggle");
    const music = document.getElementById("music-toggle");
    const trackControls = document.querySelector(".track-controls");
    const playlistPanel = document.getElementById("playlist-panel");
    if (!language && !music && !trackControls && !playlistPanel) return null;

    dock = document.createElement("div");
    dock.className = "media-dock";
    dock.setAttribute("aria-label", "Site controls");
    document.body.appendChild(dock);
    if (language) dock.appendChild(language);
    const divider = document.createElement("span");
    divider.className = "dock-divider";
    divider.setAttribute("aria-hidden", "true");
    dock.appendChild(divider);
    if (trackControls) {
      Array.from(trackControls.children).forEach((child) => dock.appendChild(child));
      trackControls.remove();
    }
    if (music) dock.appendChild(music);
    const label = document.createElement("span");
    label.id = "track-label";
    label.className = "track-label";
    label.setAttribute("aria-live", "polite");
    label.textContent = "Music";
    dock.appendChild(label);
    if (playlistPanel) dock.appendChild(playlistPanel);
    return dock;
  }

  const dock = ensureMediaDock();
  const toggleBtn = document.getElementById("lang-toggle");
  const audio = document.getElementById("bg-music");
  const musicBtn = document.getElementById("music-toggle");
  const prevTrackBtn = document.getElementById("prev-track");
  const nextTrackBtn = document.getElementById("next-track");
  const playlistPanel = document.getElementById("playlist-panel");
  const playlistToggle = document.getElementById("playlist-toggle");
  const playlistList = document.getElementById("playlist-list");
  const trackLabel = document.getElementById("track-label");

  let currentLang = storage.get(LANG_STATE_KEY) || "en";
  let pageLanguageApplier = null;
  let isMusicPlaying = false;
  let currentTrackIndex = -1;
  let saveTimer = 0;

  function validTrack(index) { return Number.isInteger(index) && index >= 0 && index < musicList.length; }

  function readMusicState() {
    const raw = storage.get(MUSIC_STATE_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (_) { return null; }
  }

  function saveMusicState() {
    if (!audio) return;
    storage.set(MUSIC_STATE_KEY, JSON.stringify({
      isPlaying: isMusicPlaying,
      trackIndex: currentTrackIndex,
      currentTime: audio.currentTime || 0,
      volume: audio.volume || 0.42,
      savedAt: Date.now()
    }));
  }

  function scheduleSave() {
    if (saveTimer || !audio) return;
    saveTimer = window.setTimeout(() => { saveTimer = 0; saveMusicState(); }, 1000);
  }

  function trackName(index) {
    return currentLang === "zh" ? `第 ${index + 1} 首` : `Track ${index + 1}`;
  }

  function updateMusicUI() {
    if (musicBtn) {
      musicBtn.textContent = isMusicPlaying ? "Pause" : "Play";
      if (currentLang === "zh") musicBtn.textContent = isMusicPlaying ? "暂停" : "播放";
      musicBtn.classList.toggle("playing", isMusicPlaying);
      musicBtn.setAttribute("aria-pressed", String(isMusicPlaying));
      musicBtn.setAttribute("aria-label", isMusicPlaying ? "Pause background music" : "Play background music");
    }
    if (trackLabel) trackLabel.textContent = currentTrackIndex >= 0 ? trackName(currentTrackIndex) : (currentLang === "zh" ? "音乐" : "Music");
    if (playlistToggle && playlistPanel) {
      const expanded = !playlistPanel.classList.contains("collapsed");
      playlistToggle.textContent = currentLang === "zh" ? "列表" : "List";
      playlistToggle.setAttribute("aria-expanded", String(expanded));
      playlistToggle.setAttribute("title", expanded ? "Close playlist" : "Open playlist");
    }
    if (playlistList) {
      playlistList.querySelectorAll(".playlist-item").forEach((item, index) => {
        item.textContent = trackName(index);
        item.classList.toggle("active", index === currentTrackIndex);
        if (index === currentTrackIndex) item.setAttribute("aria-current", "true");
        else item.removeAttribute("aria-current");
      });
    }
  }

  function buildPlaylist() {
    if (!playlistList) return;
    playlistList.replaceChildren();
    musicList.forEach((_, index) => {
      const item = document.createElement("button");
      item.className = "playlist-item";
      item.type = "button";
      item.dataset.index = String(index);
      item.textContent = trackName(index);
      item.addEventListener("click", async () => {
        try { await playTrack(index, 0); } catch (error) { console.info("Track playback was blocked:", error); }
      });
      playlistList.appendChild(item);
    });
    updateMusicUI();
  }

  function randomTrack() {
    if (musicList.length < 2) return 0;
    let index = currentTrackIndex;
    while (index === currentTrackIndex) index = Math.floor(Math.random() * musicList.length);
    return index;
  }

  async function playTrack(index, startTime) {
    if (!audio || !validTrack(index)) return;
    currentTrackIndex = index;
    audio.src = musicList[index];
    audio.volume = 0.42;
    audio.addEventListener("loadedmetadata", () => {
      if (startTime > 0 && startTime < audio.duration) audio.currentTime = startTime;
    }, { once: true });
    await audio.play();
    isMusicPlaying = true;
    updateMusicUI();
    saveMusicState();
  }

  async function playNext() {
    await playTrack(currentTrackIndex < 0 ? randomTrack() : (currentTrackIndex + 1) % musicList.length, 0);
  }

  async function playPrevious() {
    await playTrack(currentTrackIndex < 0 ? randomTrack() : (currentTrackIndex - 1 + musicList.length) % musicList.length, 0);
  }

  async function restoreMusic() {
    if (!audio) return;
    const state = readMusicState();
    if (!state || !validTrack(state.trackIndex)) { updateMusicUI(); return; }
    currentTrackIndex = state.trackIndex;
    audio.src = musicList[currentTrackIndex];
    audio.volume = state.volume || 0.42;
    if (!state.isPlaying) { updateMusicUI(); return; }
    const elapsed = Math.max(0, (Date.now() - (state.savedAt || Date.now())) / 1000);
    try { await playTrack(currentTrackIndex, Math.max(0, (state.currentTime || 0) + elapsed)); }
    catch (_) { isMusicPlaying = false; updateMusicUI(); }
  }

  if (musicBtn && audio) musicBtn.addEventListener("click", async () => {
    try {
      if (isMusicPlaying) {
        audio.pause();
        isMusicPlaying = false;
        updateMusicUI();
        saveMusicState();
      } else {
        const state = readMusicState();
        await playTrack(validTrack(state && state.trackIndex) ? state.trackIndex : randomTrack(), state ? state.currentTime || 0 : 0);
      }
    } catch (error) { console.info("Music playback was blocked:", error); }
  });
  if (prevTrackBtn && audio) prevTrackBtn.addEventListener("click", () => playPrevious().catch(() => {}));
  if (nextTrackBtn && audio) nextTrackBtn.addEventListener("click", () => playNext().catch(() => {}));
  if (playlistToggle && playlistPanel) playlistToggle.addEventListener("click", () => { playlistPanel.classList.toggle("collapsed"); updateMusicUI(); });
  if (audio) {
    audio.addEventListener("timeupdate", () => { if (isMusicPlaying) scheduleSave(); });
    audio.addEventListener("pause", () => { if (!audio.ended) saveMusicState(); });
    audio.addEventListener("ended", () => { if (isMusicPlaying) playNext().catch(() => {}); });
    window.addEventListener("beforeunload", saveMusicState);
  }

  function applyLanguage(lang) {
    currentLang = lang === "zh" ? "zh" : "en";
    storage.set(LANG_STATE_KEY, currentLang);
    document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
    if (pageLanguageApplier) pageLanguageApplier(currentLang);
    if (toggleBtn) {
      toggleBtn.textContent = currentLang === "zh" ? "中文 / EN" : "EN / 中文";
      toggleBtn.setAttribute("aria-pressed", String(currentLang === "zh"));
      toggleBtn.setAttribute("aria-label", currentLang === "zh" ? "切换到英文" : "Switch to Chinese");
    }
    updateMusicUI();
  }

  if (toggleBtn) toggleBtn.addEventListener("click", () => applyLanguage(currentLang === "en" ? "zh" : "en"));

  window.KangheSite = {
    get lang() { return currentLang; },
    init(applier) {
      pageLanguageApplier = typeof applier === "function" ? applier : null;
      applyLanguage(currentLang);
      buildPlaylist();
      restoreMusic();
    }
  };
})();
