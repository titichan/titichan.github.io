'use strict';
document.documentElement.classList.add('js');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const siteHeader = document.querySelector('.site-header');
const heroPortrait = document.querySelector('.hero-portrait');
const heroCopy = document.querySelector('.hero-copy');

document.querySelectorAll('.wave path').forEach((bar, index) => {
  const peakA = 1.12 + ((index * 7) % 8) * 0.065;
  const peakB = 1 + ((index * 11) % 9) * 0.065;
  const accent = 0.7 + ((index * 5) % 7) * 0.055;
  bar.style.setProperty('--wave-delay', `${(-index * 0.038).toFixed(3)}s`);
  bar.style.setProperty('--wave-peak-a', peakA.toFixed(2));
  bar.style.setProperty('--wave-peak-b', peakB.toFixed(2));
  bar.style.setProperty('--wave-accent', accent.toFixed(2));
});
const samplePlayers = [...document.querySelectorAll('.voice-sample-player')];
const formatSampleTime = seconds => {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${String(Math.floor(safeSeconds / 60)).padStart(2, '0')}:${String(safeSeconds % 60).padStart(2, '0')}`;
};
samplePlayers.forEach(player => {
  const audio = player.querySelector('audio');
  const button = player.querySelector('.sample-play');
  const progress = player.querySelector('.sample-timeline span');
  const time = player.querySelector('.sample-time');
  const playLabel = button.getAttribute('aria-label');
  const updateProgress = () => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 25;
    const ratio = duration > 0 ? Math.min(audio.currentTime / duration, 1) : 0;
    progress.style.clipPath = `inset(0 ${((1 - ratio) * 100).toFixed(3)}% 0 0)`;
    time.textContent = `${formatSampleTime(audio.currentTime)} / ${formatSampleTime(duration)}`;
  };
  const updatePlaybackState = () => {
    const playing = !audio.paused && !audio.ended;
    player.classList.toggle('is-playing', playing);
    button.textContent = playing ? 'PAUSE' : 'PLAY';
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', playing ? playLabel.replace('再生', '一時停止') : playLabel);
  };
  button.addEventListener('click', () => {
    if (audio.paused) audio.play().catch(() => updatePlaybackState());
    else audio.pause();
  });
  audio.addEventListener('play', () => {
    samplePlayers.forEach(otherPlayer => {
      const otherAudio = otherPlayer.querySelector('audio');
      if (otherAudio !== audio) otherAudio.pause();
    });
    updatePlaybackState();
  });
  audio.addEventListener('pause', updatePlaybackState);
  audio.addEventListener('ended', updatePlaybackState);
  audio.addEventListener('loadedmetadata', updateProgress);
  audio.addEventListener('timeupdate', updateProgress);
  updatePlaybackState();
});
const heroPlusField = document.querySelector('.hero-plus-field');
if (heroPortrait && heroPlusField) {
  const heroHoverMedia = window.matchMedia('(min-width: 701px) and (hover: hover) and (pointer: fine)');
  const plusCount = 64;
  const plusFragment = document.createDocumentFragment();
  for (let index = 0; index < plusCount; index += 1) {
    const angle = (Math.PI * 2 * index) / plusCount;
    const ring = index % 3;
    const radiusX = 40 + ring * 3.2 + ((index * 7) % 5) * 0.45;
    const radiusY = 39 + ring * 2.7 + ((index * 11) % 5) * 0.4;
    const jitterX = (((index * 17) % 9) - 4) * 0.45;
    const jitterY = (((index * 23) % 9) - 4) * 0.5;
    const plus = document.createElement('span');
    plus.textContent = '+';
    plus.style.left = `${50 + Math.cos(angle) * radiusX + jitterX}%`;
    plus.style.top = `${49 + Math.sin(angle) * radiusY + jitterY}%`;
    plus.style.fontSize = `${8 + ((index * 5) % 7)}px`;
    plus.style.setProperty('--plus-delay', `${((index * 5) % 19) * 0.025}s`);
    plus.style.setProperty('--plus-opacity', `${0.58 + ((index * 5) % 6) * 0.075}`);
    plus.style.setProperty('--plus-tilt', `${-13 + ((index * 11) % 27)}deg`);
    plusFragment.append(plus);
  }
  heroPlusField.append(plusFragment);
  heroPortrait.addEventListener('mouseenter', () => {
    if (heroHoverMedia.matches) heroPlusField.classList.add('is-active');
  });
  heroPortrait.addEventListener('mouseleave', () => heroPlusField.classList.remove('is-active'));
  heroHoverMedia.addEventListener('change', event => {
    if (!event.matches) heroPlusField.classList.remove('is-active');
  });
}

const loadIntro = document.querySelector('.load-intro');
const introStartedAt = performance.now();
let introReady = !loadIntro || reducedMotion.matches;
const introQueue = [];
const afterIntro = callback => {
  if (introReady) callback();
  else introQueue.push(callback);
};
if (loadIntro) {
  let introRemoved = false;
  const removeIntro = () => {
    if (introRemoved) return;
    introRemoved = true;
    loadIntro.remove();
    introReady = true;
    introQueue.splice(0).forEach(callback => callback());
  };
  if (reducedMotion.matches) removeIntro();
  else {
    loadIntro.addEventListener('animationend', event => {
      if (event.target === loadIntro) removeIntro();
    });
    window.setTimeout(removeIntro, 4100);
  }
}
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const navigationLinks = navigation.querySelectorAll('a');
toggle.hidden = false;
let menuCloseTimer;
const finishMenuClose = () => {
  window.clearTimeout(menuCloseTimer);
  navigation.classList.remove('is-closing');
};
const setMenuOpen = open => {
  toggle.setAttribute('aria-expanded', String(open));
  if (open) {
    finishMenuClose();
    navigation.classList.add('is-open');
    return;
  }
  const shouldAnimate = navigation.classList.contains('is-open')
    && window.matchMedia('(max-width: 700px)').matches
    && !reducedMotion.matches;
  navigation.classList.remove('is-open');
  navigation.classList.toggle('is-closing', shouldAnimate);
  window.clearTimeout(menuCloseTimer);
  if (shouldAnimate) menuCloseTimer = window.setTimeout(finishMenuClose, 540);
};
const closeMenu = () => setMenuOpen(false);
navigation.addEventListener('animationend', event => {
  if (event.target === navigation && event.animationName === 'mobile-menu-close') {
    finishMenuClose();
  }
});
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  setMenuOpen(open);
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus({ preventScroll: true }); }
});
window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      navigationLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-10% 0px -65% 0px', threshold: 0 });
  document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
}

// Finite entrances only. Default DOM stays visible; no overlay or hidden classes.
const entrances = new Set();
function enterOnce(element, {
  distance = 10,
  distanceX = 0,
  startOpacity = 0.025,
  delay = 0,
  blur = 5,
  scale = 0.996,
  duration = 2100
} = {}) {
  if (!element) return;
  if (element.dataset.entered || reducedMotion.matches || !element.animate) {
    element.classList.remove('reveal-pending');
    return;
  }
  element.dataset.entered = 'true';
  const directional = distanceX !== 0;
  const keyframes = directional ? [
    { opacity: startOpacity, translate: `${distanceX}px ${distance}px`, scale, filter: `blur(${blur}px)` },
    { opacity: 1, translate: '0 0', scale: 1, filter: 'blur(0)' }
  ] : [
    { opacity: startOpacity, translate: `0 ${distance}px`, scale, filter: `blur(${blur}px)` },
    { opacity: 0.58, offset: 0.62, translate: '0 1px', scale: 0.999, filter: 'blur(1px)' },
    { opacity: 1, translate: '0 0', scale: 1, filter: 'blur(0)' }
  ];
  const animation = element.animate(keyframes, {
    duration,
    delay,
    easing: directional ? 'cubic-bezier(.16,1,.3,1)' : 'cubic-bezier(.22,.65,.28,1)',
    fill: 'backwards',
    iterations: 1
  });
  element.classList.remove('reveal-pending');
  entrances.add(animation);
  const done = () => entrances.delete(animation);
  animation.onfinish = done;
  animation.oncancel = done;
}
function revealWhenReady(element, options) {
  const images = [
    ...(element.matches('img') ? [element] : []),
    ...element.querySelectorAll('img')
  ];
  const ready = images.map(image => {
    if (image.complete) return image.decode?.().catch(() => undefined) ?? Promise.resolve();
    return new Promise(resolve => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    }).then(() => image.decode?.().catch(() => undefined));
  });
  Promise.race([
    Promise.all(ready),
    new Promise(resolve => window.setTimeout(resolve, 1800))
  ]).then(() => enterOnce(element, options));
}
const revealHero = () => {
  const run = () => {
    enterOnce(siteHeader, { distance: -3, startOpacity: 0.16, blur: 3, scale: 0.999, duration: 1750 });
    enterOnce(heroPortrait, { distance: 3, distanceX: 24, startOpacity: 0.035, delay: 240, blur: 4, scale: 0.997, duration: 2450 });
    enterOnce(heroCopy, { distance: 10, startOpacity: 0.01, delay: 480, blur: 5, scale: 0.998, duration: 2300 });
  };
  if (!loadIntro || reducedMotion.matches || introReady) run();
  else {
    const remaining = Math.max(0, 1750 - (performance.now() - introStartedAt));
    window.setTimeout(run, remaining);
  }
};
if (heroPortrait?.complete) revealHero();
else heroPortrait?.addEventListener('load', revealHero, { once: true });
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const entranceTargets = [...document.querySelectorAll([
    '.character>.section-heading',
    '.character-art',
    '.character-info',
    '.voicebank>.heading-with-wave',
    '.voicebank>.intro',
    '.voicebank-mascot',
    '.releases',
    '.demo-heading',
    '.demo-player-group',
    '.demo-layout>.chibi',
    '.terms-aside .section-heading',
    '.terms-aside>.chibi',
    '.terms-content',
    '.site-footer',
    '.site-footer>.chibi'
  ].join(','))];
  entranceTargets.forEach(element => element.classList.add('reveal-pending'));
  const entranceObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entranceObserver.unobserve(entry.target);
      const secondary = entry.target.matches('.character-info,.releases,.terms-content');
      const artFromLeft = entry.target.matches('.character-art,.voicebank-mascot,.terms-aside>.chibi');
      const artFromRight = entry.target.matches('.demo-layout>.chibi,.site-footer>.chibi');
      afterIntro(() => revealWhenReady(entry.target, {
        distance: artFromLeft || artFromRight ? 4 : (secondary ? 12 : 8),
        distanceX: artFromLeft ? -26 : (artFromRight ? 26 : 0),
        delay: secondary ? 190 : (artFromLeft || artFromRight ? 120 : 0),
        blur: secondary ? 6 : (artFromLeft || artFromRight ? 3 : 4),
        scale: artFromLeft || artFromRight ? 0.997 : (secondary ? 0.995 : 0.998),
        duration: artFromLeft || artFromRight ? 2350 : (secondary ? 2250 : 2100)
      }));
    }
  }, { threshold: 0.06, rootMargin: '0px 0px -8% 0px' });
  entranceTargets.forEach(element => entranceObserver.observe(element));
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    entranceObserver.disconnect();
    entranceTargets.forEach(element => element.classList.remove('reveal-pending'));
    entrances.forEach(animation => animation.cancel());
    entrances.clear();
  });
}
