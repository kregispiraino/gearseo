const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const floatingVideoCard = document.querySelector('.floating-video-card');
const floatingVideo = floatingVideoCard?.querySelector('.presentation-video');
const playButton = floatingVideoCard?.querySelector('.play-dot');
const minimizeButton = floatingVideoCard?.querySelector('.floating-minimize');
const floatingBubble = document.querySelector('.floating-video-bubble');
const playPauseButton = floatingVideoCard?.querySelector('.video-play-pause');
const progressInput = floatingVideoCard?.querySelector('.video-progress');
const currentTimeLabel = floatingVideoCard?.querySelector('.video-current');
const durationLabel = floatingVideoCard?.querySelector('.video-duration');

if (menuButton) {
  menuButton.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

if (mobileNav) {
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      menuButton?.setAttribute('aria-expanded', 'false');
    });
  });
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

function updateVideoControls() {
  if (!floatingVideo) return;

  const duration = floatingVideo.duration || 0;
  const currentTime = floatingVideo.currentTime || 0;

  if (currentTimeLabel) currentTimeLabel.textContent = formatTime(currentTime);
  if (durationLabel) durationLabel.textContent = formatTime(duration);

  if (progressInput && duration > 0) {
    progressInput.value = String((currentTime / duration) * 100);
  }

  if (playPauseButton) {
    playPauseButton.textContent = floatingVideo.paused ? '▶' : '❚❚';
    playPauseButton.setAttribute('aria-label', floatingVideo.paused ? 'Reproduzir vídeo' : 'Pausar vídeo');
  }
}

function expandPresentation() {
  if (!floatingVideoCard || !floatingVideo) return;

  floatingVideoCard.classList.remove('is-minimized');
  floatingVideoCard.classList.add('is-expanded');
  floatingBubble?.classList.remove('is-visible');

  floatingVideo.loop = false;
  floatingVideo.muted = false;
  floatingVideo.currentTime = 0;
  floatingVideo.play().catch(() => {});
  updateVideoControls();
}

function collapsePresentation(event) {
  event?.stopPropagation();
  if (!floatingVideoCard || !floatingVideo) return;

  floatingVideoCard.classList.remove('is-expanded');
  floatingVideoCard.classList.add('is-minimized');
  floatingBubble?.classList.add('is-visible');

  floatingVideo.loop = true;
  floatingVideo.muted = true;
  floatingVideo.play().catch(() => {});
  updateVideoControls();
}

function restorePresentation() {
  if (!floatingVideoCard || !floatingVideo) return;

  floatingVideoCard.classList.remove('is-minimized');
  floatingVideoCard.classList.remove('is-expanded');
  floatingBubble?.classList.remove('is-visible');

  floatingVideo.loop = true;
  floatingVideo.muted = true;
  floatingVideo.play().catch(() => {});
  updateVideoControls();
}

floatingVideoCard?.addEventListener('click', (event) => {
  if (event.target.closest('button') || event.target.closest('.video-controls') || floatingVideoCard.classList.contains('is-expanded')) return;
  expandPresentation();
});

playButton?.addEventListener('click', (event) => {
  event.stopPropagation();
  expandPresentation();
});

minimizeButton?.addEventListener('click', collapsePresentation);
floatingBubble?.addEventListener('click', restorePresentation);

playPauseButton?.addEventListener('click', (event) => {
  event.stopPropagation();
  if (!floatingVideo) return;

  if (floatingVideo.paused) {
    floatingVideo.play().catch(() => {});
  } else {
    floatingVideo.pause();
  }
  updateVideoControls();
});

progressInput?.addEventListener('input', (event) => {
  event.stopPropagation();
  if (!floatingVideo || !floatingVideo.duration) return;

  const percentage = Number(event.target.value) / 100;
  floatingVideo.currentTime = percentage * floatingVideo.duration;
  updateVideoControls();
});

floatingVideo?.addEventListener('loadedmetadata', updateVideoControls);
floatingVideo?.addEventListener('timeupdate', updateVideoControls);
floatingVideo?.addEventListener('play', updateVideoControls);
floatingVideo?.addEventListener('pause', updateVideoControls);
floatingVideo?.addEventListener('ended', updateVideoControls);
