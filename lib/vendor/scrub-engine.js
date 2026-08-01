/* ============================================================================
   scroll-world — portable scroll-scrubbed camera-flight engine
   ----------------------------------------------------------------------------
   Framework-agnostic. Vanilla JS, zero dependencies. It builds its own DOM and
   injects its own (namespaced) CSS into a container you give it, so it drops into
   plain HTML, Next.js (call from a ref/useEffect), Vue (onMounted), a server-
   rendered page, anything.

   USAGE
     mountScrollWorld(document.getElementById('world'), {
       brand: { name: 'Pearl & Co.', href: '#top' },
       diveScroll: 1.3,   // viewport-heights of scroll per dive clip
       connScroll: 0.9,   // ...per connector clip
       hint: 'scroll to fly in',
       nav: true,         // show the top section nav
       atmosphere: true,  // subtle gradient + drifting particles behind the clips
       fps: 24,           // source frame rate — the scrub quantises seeks to this grid.
                          // Set it to match your encodes; a wrong value only costs
                          // smoothness (too high) or precision (too low).
       keepClips: 2,      // segments either side of the current one that keep a live
                          // <video>. Everything else falls back to its still. Defaults
                          // to 2 (1 on touch) — browsers cap concurrent decoders.
       sections: [
         { id, label, still, stillMobile, clip, clipMobile, accent,
           scroll: 1.6,   // optional per-section override of diveScroll — more scroll
                          // distance = a slower, longer dwell in this scene
           linger: 0.5,   // optional 0..1 — remaps time so the camera settles mid-scene
                          // (exactly where the copy peaks) and moves quicker at the
                          // edges. 0 = linear (default). Keep ≤ 0.6; 1 = full pause.
           eyebrow, title, body, tags:[…],
           cta:{ primary:{label,href}, secondary:{label,href} } }, // last section only
         …
       ],
       connectors: [clipUrl, …],          // length = sections.length - 1 (nulls allowed)
       connectorsMobile: [clipUrl, …],    // optional lighter connectors for phones (same length)

   MOBILE (the clipMobile/connectorsMobile variants are the opt-in mobile version;
   the rest of the phone handling below is always on)
     The engine is phone-aware out of the box: on a coarse-pointer / ≤860px viewport it
       - loads `clipMobile` / `connectorsMobile` when the viewport is also PORTRAIT
         (a landscape tablet is coarse-pointered too, and the 9:16 encodes crop away
         most of the frame there), when provided (encode these smaller +
         tighter-GOP — seek cost on a phone decoder is dominated by frames-from-keyframe,
         so a 720p, -g 4 file scrubs far smoother than the 1080p desktop master; see
         pipeline.md). Falls back to the desktop `clip` if no mobile variant is given.
       - uses `stillMobile` as the scene poster when provided (pair it with native 9:16
         clipMobile renders so the poster matches the portrait video's first frame instead
         of flashing from a landscape crop). Chosen once at mount; a desktop resize into
         phone width keeps the desktop poster (clips still switch via isMobile()).
       - coalesces seeks (never issues a new currentTime while the decoder is still
         `seeking`) so fast flicks can't pile up and freeze the video.
       - keeps the still as a live poster until the clip actually paints its first frame,
         and primes each video (muted play→pause) on first touch — this is what stops iOS
         from showing a blank scene before the first seek.
       - drops the drifting particles and ignores URL-bar-only resizes (no scroll jump).
     Nothing here is required — a config with only `clip`/`connectors` still works on
     phones; the mobile variants just make it lighter and smoother.

   THEME (CSS custom properties; set on the container or :root to override)
     --sw-bg         page background (match your scene bg for seamless posters)
     --sw-ink        primary text
     --sw-ink-soft   secondary text
     --sw-accent     default accent (each section overrides via its `accent`)
     --sw-font-display / --sw-font-body

   REQUIREMENTS ON YOUR ASSETS
     - clips encoded native-res, crf~20, -g 8, +faststart, no audio (see pipeline.md)
     - connectors' endpoints are the neighbouring dives' ACTUAL frames (see SKILL Step 5)
     - (optional) mobile variants at ~720p, -g 4 for smoother phone scrubbing
   The engine sets the clip URL directly on the <video> and scrubs currentTime, so the
   decoder can start on the first buffered keyframe instead of waiting for the whole
   file. That means your host MUST answer byte-range requests (206) for the media —
   every static host and CDN does, including Next.js /public. (Earlier versions fetched
   each clip into a Blob to sidestep that requirement; the cost was several seconds of
   blank scene per clip and the entire chain resident in memory.)
   ========================================================================== */

function mountScrollWorld(container, config) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Phone detection. `coarse` is captured once (input type doesn't change mid-session);
  // the ≤860px query is read live via isMobile() so a desktop resize/DevTools toggle
  // switches sources and seek behaviour without a reload.
  const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const smallMQ = window.matchMedia('(max-width: 860px)');
  const isMobile = () => coarse || smallMQ.matches;
  // Asset choice is a separate question from input type. The mobile encodes are
  // native 9:16; feeding them to a LANDSCAPE viewport (iPad, touch laptop, phone
  // rotated) crops away most of the frame. Only serve them to a portrait viewport.
  const usePortraitAssets = () => isMobile() && window.innerHeight >= window.innerWidth;
  const SECTIONS = config.sections || [];
  const CONNECTORS = config.connectors || [];
  const CONNECTORS_M = config.connectorsMobile || [];
  const DIVE_W = config.diveScroll || 1.3;
  const CONN_W = config.connScroll || 0.9;
  const CROSSFADE = (config.crossfade != null) ? config.crossfade : 0.12;  // seam dissolve width (vh)
  // Scrub granularity. Seeking to a time that lands on the same decoded frame is
  // pure cost — it re-decodes and paints nothing new. Quantising the target to the
  // source frame grid collapses a per-rAF seek storm into at most one seek per frame.
  const FPS = config.fps || 24;
  const FRAME = 1 / FPS;
  // How many segments either side of the current one keep a live <video>. Browsers
  // cap concurrent hardware decoders (mobile Safari far lower than desktop Chrome);
  // holding all 9 alive is what makes later scenes silently stop painting on a phone.
  const KEEP = (config.keepClips != null) ? config.keepClips : (coarse ? 1 : 2);
  // How far ahead/behind to DOWNLOAD. Wider than KEEP on purpose: bytes are cheap to
  // hold and a clip that is already resident when you reach it is the whole point,
  // whereas decoders are scarce and stay bounded by KEEP.
  const PREFETCH = (config.prefetch != null) ? config.prefetch : KEEP + 2;
  const MAX_PARALLEL = 1;
  const MAX_FAILS = 3;
  const now = () => (window.performance && performance.now) ? performance.now() : Date.now();
  let activeSeg = 0, inFlight = 0;
  const N = SECTIONS.length;
  let dead = false;
  if (!N) return () => {};

  injectCSS();
  container.classList.add('sw-root');

  // ---- build the interleaved segment chain: dive0, conn0, dive1, … diveN-1 ----
  const SEGMENTS = [];
  SECTIONS.forEach((s, i) => {
    const dive = { kind: 'dive', si: i, clip: s.clip, clipM: s.clipMobile, still: s.still, stillM: s.stillMobile,
                   accent: s.accent, w: s.scroll || DIVE_W, linger: s.linger || 0 };
    SEGMENTS.push(dive);
    s._seg = dive;
    // A connector is optional: if connectors[i] is falsy, the two dives simply
    // crossfade directly (no fly-over). Lets a page complete even when a
    // connector can't be generated (e.g. a content-filter false-positive).
    if (i < N - 1 && CONNECTORS[i]) {
      // Poster = the ORIGIN scene, not the destination. A connector starts on the
      // frame the previous dive ended on, so posting the next scene's artwork made
      // the picture jump BACKWARDS at a fixed scroll position the moment the
      // connector clip arrived. The accent still leads into the destination.
      SEGMENTS.push({ kind: 'conn', si: i, clip: CONNECTORS[i], clipM: CONNECTORS_M[i],
                      still: SECTIONS[i].still, stillM: SECTIONS[i].stillMobile,
                      accent: SECTIONS[i + 1].accent, w: CONN_W });
    }
  });
  const NSEG = SEGMENTS.length;

  // ---- DOM ----
  const sky = el('div', 'sw-sky');
  if (config.atmosphere !== false) {
    sky.appendChild(el('div', 'sw-sky__grad'));
    sky.appendChild(el('div', 'sw-sky__glow'));
  }
  const particles = el('div', 'sw-particles'); sky.appendChild(particles);

  const scrollbar = el('div', 'sw-scrollbar');
  const scrollbarFill = el('span'); scrollbar.appendChild(scrollbarFill);

  const topbar = el('div', 'sw-topbar');
  if (config.brand) {
    const brand = el('a', 'sw-brand'); brand.href = (config.brand.href || '#');
    brand.appendChild(el('span', 'sw-brand__mark'));
    const nm = el('span', 'sw-brand__name'); nm.textContent = config.brand.name || ''; brand.appendChild(nm);
    topbar.appendChild(brand);
  }
  const nav = el('nav', 'sw-nav'); if (config.nav !== false) topbar.appendChild(nav);
  if (config.cta && config.cta.label) {
    const c = el('a', 'sw-topcta'); c.href = config.cta.href || '#'; c.textContent = config.cta.label;
    topbar.appendChild(c);
  }

  const stage = el('div', 'sw-stage');
  const copylayer = el('div', 'sw-copylayer');
  const route = el('div', 'sw-route');
  const hint = el('div', 'sw-hint');
  const hintText = el('span'); hintText.textContent = config.hint || 'scroll'; hint.appendChild(hintText);
  hint.appendChild(el('i'));
  const track = el('div', 'sw-track');

  [sky, scrollbar, topbar, stage, copylayer, route, hint, track].forEach(n => container.appendChild(n));

  // segment scenes
  SEGMENTS.forEach((s, i) => {
    const scene = el('div', 'sw-scene'); scene.style.setProperty('--sw-accent', s.accent || '');
    const img = el('img', 'sw-scene__still'); img.alt = ''; img.decoding = 'async';
    // The first scene's still IS the LCP element — lazy-loading it puts an empty
    // viewport in front of the visitor for as long as the loader takes to get to it.
    if (i === 0) { img.loading = 'eager'; img.fetchPriority = 'high'; }
    else img.loading = 'lazy';
    const poster = (usePortraitAssets() && s.stillM) ? s.stillM : s.still;
    if (poster) img.src = poster;
    scene.appendChild(img); stage.appendChild(scene);
    s.el = scene; s.img = img; s.video = null; s.hasClip = false;
    s.loading = false; s.ready = false; s.blobUrl = null; s.abort = null;
    s.fails = 0; s.retryAt = 0;
    s.cur = 0; s.target = 0; s.visible = false; s.lastSeek = -1;
  });

  // per-section copy / route / nav
  const copies = [], dots = [];
  SECTIONS.forEach((s, i) => {
    const c = el('article', 'sw-copy'); c.style.setProperty('--sw-accent', s.accent || '');
    c.innerHTML =
      `<span class="sw-copy__num">${pad(i + 1)} / ${pad(N)}</span>` +
      (s.eyebrow ? `<span class="sw-copy__eyebrow">${esc(s.eyebrow)}</span>` : '') +
      (s.title ? `<h2 class="sw-copy__title">${esc(s.title)}</h2>` : '') +
      (s.body ? `<p class="sw-copy__body">${esc(s.body)}</p>` : '') +
      (s.tags && s.tags.length ? `<ul class="sw-copy__tags">${s.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : '') +
      (s.cta ? `<div class="sw-copy__cta">${ctaBtns(s.cta)}</div>` : '');
    // Off-screen copy is at opacity 0 but still in the tab order — a keyboard user
    // tabbing from the top bar would otherwise land on the final section's CTA while
    // it is invisible and 15 viewports away. read() flips this per frame.
    c.inert = true;
    copylayer.appendChild(c); copies.push(c);

    const dot = el('button', 'sw-route__dot'); dot.style.setProperty('--sw-accent', s.accent || '');
    // The label is display:none on phones, which strips the button's accessible
    // name — hence an explicit one that survives every breakpoint.
    dot.setAttribute('aria-label', s.label || `Section ${i + 1}`);
    dot.innerHTML = `<span class="sw-route__label">${esc(s.label || '')}</span><i></i>`;
    dot.addEventListener('click', () => jumpTo(i)); route.appendChild(dot); dots.push(dot);

    if (config.nav !== false) {
      const b = el('button', 'sw-nav__item'); b.textContent = s.label || '';
      b.addEventListener('click', () => jumpTo(i)); nav.appendChild(b);
    }
  });

  // ---- math ----
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  // Per-section dwell: monotone remap of scroll→time so the camera settles mid-scene
  // (where the copy peaks) and moves quicker near the seams. L=0 linear, L=1 full
  // mid-scene pause. f(0)=0, f(1)=1 always, so seam frames are untouched.
  const lingerEase = (x, L) => { L = clamp(L); const c = x - 0.5; return (1 - L) * x + L * (4 * c * c * c + 0.5); };
  let vh = window.innerHeight, stageX = 0, totalW = 0, activeIndex = -1, ticking = false;
  let laidOutW = window.innerWidth;   // width the current layout was computed at (see onResize)
  // Largest viewport height seen this session. The tail of the track must clear the
  // TALLEST the viewport ever gets: on a phone the URL bar collapses as you scroll,
  // innerHeight grows, and a tail sized to the initial (short) viewport leaves the
  // final flight a hundred-odd pixels short of its last frame.
  let maxVH = window.innerHeight;

  function trackHeight() { return totalW * vh + maxVH; }

  function layout(preserve = true) {
    // Keep the visitor at the same point in the flight when the geometry changes,
    // instead of teleporting them because the pixel scale moved under them.
    const prev = (preserve && totalW > 0) ? (window.scrollY || window.pageYOffset) / (totalW * vh) : null;
    vh = window.innerHeight;
    maxVH = Math.max(maxVH, vh);
    laidOutW = window.innerWidth;
    stageX = window.innerWidth > 860 ? 4 : 0;
    let off = 0;
    SEGMENTS.forEach(s => { s.start = off * vh; off += s.w; s.end = off * vh; });
    totalW = off;
    track.style.height = trackHeight() + 'px';
    if (prev !== null && prev > 0) window.scrollTo(0, prev * totalW * vh);
    read();
  }

  function jumpTo(i) {
    const seg = SECTIONS[i]._seg;
    // Land where that section's COPY peaks, not at a blanket midpoint. read() fades
    // the first section's copy out from pr=0 and the last one in by pr=0.4, so
    // jumping to 0.5 dropped you on an intro scene with no copy on it at all.
    const peak = (i === 0) ? 0 : 0.5;
    const top = seg.start + (seg.end - seg.start) * peak;
    // A smooth scroll across the whole 17-viewport track sweeps every scene in
    // between, and each one it touches wants to load and seek. Past a few viewports
    // that is a second of lockup for no benefit — jump instead.
    const far = Math.abs(top - (window.scrollY || window.pageYOffset)) > 3 * vh;
    window.scrollTo({ top, behavior: (reduce || far) ? 'auto' : 'smooth' });
  }

  // Fetch the WHOLE clip before showing any of it.
  //
  // Scrubbing is random access: the next scroll frame can ask for any timestamp in
  // the file. A progressively-downloaded MP4 only holds what has arrived so far, so
  // seeking past the buffer drops readyState to HAVE_METADATA — no frame renders and
  // `seeking` latches true, which is the "frozen picture instead of scrubbing video"
  // failure. A fully-resident Blob is the only source that can answer every seek, so
  // the video element is not created until the bytes are all here. The still stays up
  // and keeps animating until then, which is the correct thing to show anyway.
  // Serve the lighter portrait encode to portrait phones when one was provided.
  function clipUrl(s) { return (usePortraitAssets() && s.clipM) ? s.clipM : s.clip; }

  function fetchClip(s) {
    s.loading = true; inFlight++;
    const ac = (typeof AbortController === 'function') ? new AbortController() : null;
    s.abort = ac;
    const done = () => { s.loading = false; s.abort = null; inFlight--; };
    fetch(clipUrl(s), ac ? { signal: ac.signal } : undefined)
      .then(r => r.ok ? r.blob() : Promise.reject(new Error('HTTP ' + r.status)))
      .then(blob => {
        done();
        if (dead) return;
        s.blobUrl = URL.createObjectURL(blob);
        if (Math.abs(SEGMENTS.indexOf(s) - activeSeg) <= KEEP) attachVideo(s);
        pump();
      })
      .catch(err => {
        done();
        if (dead || (err && err.name === 'AbortError')) { pump(); return; }
        // Bounded retry with backoff. Failing permanently on the first error is what
        // turned one hiccup into a scene that stayed a still for the rest of the
        // session; retrying every frame is what turned a 404 into a request storm.
        s.fails = (s.fails || 0) + 1;
        s.retryAt = now() + 1500 * s.fails;
        pump();
      });
  }

  // One download at a time, always the clip nearest to where the visitor actually is.
  // Running three concurrent 4 MB fetches just splits the pipe three ways and makes
  // the one clip they are about to reach arrive last.
  //
  // Under prefers-reduced-motion nothing is ever fetched: the stills stay up and
  // cross-dissolve as you scroll. No scrubbed video motion, no decode cost.
  function pump() {
    if (dead || reduce || inFlight >= MAX_PARALLEL) return;
    const t = now();
    let best = null, bestD = Infinity;
    for (let i = 0; i < NSEG; i++) {
      const s = SEGMENTS[i];
      if (!s.clip || s.blobUrl || s.loading) continue;
      if (s.fails >= MAX_FAILS || (s.retryAt && t < s.retryAt)) continue;
      const d = Math.abs(i - activeSeg);
      if (d > PREFETCH) continue;
      if (d < bestD) { bestD = d; best = s; }
    }
    if (best) fetchClip(best);
  }

  function attachVideo(s) {
    if (s.video || !s.blobUrl || dead) return;
    const v = document.createElement('video');
    v.className = 'sw-scene__video';
    v.muted = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    v.addEventListener('loadedmetadata', () => { s.ready = true; scheduleRead(); });
    v.addEventListener('loadeddata', () => { try { v.pause(); } catch (e) {} if (userReady) primeVideo(v); });
    // Reveal (hide the still) once a real frame has painted. rVFC is the strongest
    // signal but it only fires when a frame is actually presented for composition,
    // which a paused off-screen video may never do — and `seeked` never fires for a
    // scene the visitor lands on at rest (target time 0 == currentTime 0). Register
    // every path and let whichever arrives first win; classList.add is idempotent.
    // Since the clip is fully resident by now, none of them can reveal a blank frame.
    const reveal = () => { if (!dead) s.el.classList.add('has-clip'); };
    if (typeof v.requestVideoFrameCallback === 'function') v.requestVideoFrameCallback(reveal);
    v.addEventListener('seeked', reveal, { once: true });
    v.addEventListener('loadeddata', reveal, { once: true });
    // A blob-backed element should not fail, but if it does, drop the bytes and let
    // the queue re-fetch rather than stranding the scene on its still.
    v.addEventListener('error', () => { releaseClip(s); s.fails = (s.fails || 0) + 1; pump(); });
    v.src = s.blobUrl;
    s.el.appendChild(v); s.video = v; s.hasClip = true;
  }

  // Free the DECODER, keep the bytes. Browsers cap concurrent hardware decoders
  // (mobile Safari at a handful), which is what makes later scenes stop painting on a
  // phone — but the blob is cheap to keep, and keeping it is what makes scrolling
  // back up instant instead of a re-download. src='' + load() is what actually
  // releases the decoder; removing the element alone does not.
  function detachVideo(s) {
    const v = s.video;
    s.video = null; s.hasClip = false; s.ready = false; s.lastSeek = -1;
    s.el.classList.remove('has-clip');
    if (!v) return;
    try { v.pause(); } catch (e) {}
    try { v.removeAttribute('src'); v.load(); } catch (e) {}
    try { v.remove(); } catch (e) {}
  }

  // Decoder + bytes + any in-flight request.
  function releaseClip(s) {
    if (s.abort) { try { s.abort.abort(); } catch (e) {} }
    detachVideo(s);
    if (s.blobUrl) { URL.revokeObjectURL(s.blobUrl); s.blobUrl = null; }
  }

  // Follows the scroll: decoders only near the visitor, downloads queued outward.
  function syncClips(ci) {
    activeSeg = ci;
    for (let i = 0; i < NSEG; i++) {
      const s = SEGMENTS[i];
      if (Math.abs(i - ci) <= KEEP) attachVideo(s);
      else if (s.video) detachVideo(s);
    }
    pump();
  }

  function read() {
    const y = window.scrollY || window.pageYOffset;
    const fade = CROSSFADE * vh;
    let ci = 0;
    for (let i = 0; i < NSEG; i++) if (y >= SEGMENTS[i].start) ci = i;

    syncClips(ci);

    for (let i = 0; i < NSEG; i++) {
      const s = SEGMENTS[i];
      const local = clamp((y - s.start) / (s.end - s.start), 0, 1);
      s.target = s.linger ? lingerEase(local, s.linger) : local;
      // Dissolve by fading the INCOMING scene up over an outgoing one that stays
      // fully opaque. Fading both at once is what turns every seam dark: at the
      // midpoint each sits at ~0.5, so the composite is only ~75% opaque and the
      // near-black sky shows straight through the pair.
      //
      // The outgoing scene therefore holds at 1 until the incoming has fully covered
      // it, then drops out — invisible at that point, since it is underneath. The
      // first segment never fades in (nothing precedes it) and the last never drops
      // out: max scrollY overshoots its end by (maxVH - innerHeight) whenever the
      // viewport has ever been taller than it is now (collapsed-then-restored mobile
      // URL bar, DevTools docked after load), which would blank the closing scene and
      // the CTA on it.
      const lead = (i === 0) ? 1 : clamp((y - s.start) / fade);
      const covered = (i < NSEG - 1) && (y > s.end + fade);
      const op = covered ? 0 : smooth(lead);
      s.el.style.opacity = op;
      const wasVisible = s.visible;
      s.visible = op > 0.001;
      // Hidden scenes must not stay composited: nine full-viewport layers is enough
      // GPU memory to stall a phone on its own. But a hidden <video> may drop its
      // presented frame, and the seek dedupe would not re-issue one at the same
      // timestamp — so force the next frame to repaint on the way back in.
      if (s.visible !== wasVisible) {
        s.el.style.visibility = s.visible ? 'visible' : 'hidden';
        if (s.visible) s.lastSeek = -1;
      }
      s.el.style.zIndex = (i === ci) ? '120' : String(100 + Math.round(op * 10));
      if (!s.hasClip || !s.ready) {
        // The still is nudged sideways to sit under the copy; it must be scaled
        // enough to cover that shift or a strip of empty sky shows down one edge —
        // which is every scene, permanently, under prefers-reduced-motion.
        const sc = reduce ? 1 : 1.08 + local * 0.14;
        const tx = reduce ? 0 : stageX - 2;
        s.img.style.transform = `translateX(${tx}vw) scale(${sc.toFixed(3)})`;
      }
    }

    for (let i = 0; i < N; i++) {
      const seg = SECTIONS[i]._seg;
      const pr = clamp((y - seg.start) / (seg.end - seg.start), 0, 1);
      const before = y < seg.start, after = y > seg.end;
      let cop;
      if (i === 0) cop = after ? 0 : smooth(1 - pr / 0.62);            // greets on landing
      else if (i === N - 1) cop = before ? 0 : smooth(pr / 0.4);       // holds CTA at the end
      else cop = (before || after) ? 0 : smooth(1 - Math.abs(pr - 0.5) / 0.5);
      const c = copies[i];
      c.style.opacity = cop;
      // Publish the parallax offset as a custom property rather than writing
      // `transform`: each breakpoint composes it with its own transform, and a direct
      // write would clobber the desktop rule's translateY(-50%) centring.
      c.style.setProperty('--sw-copy-shift', reduce ? '0vh' : `${((0.5 - pr) * 4).toFixed(2)}vh`);
      const live = cop > 0.5;
      c.style.pointerEvents = live ? 'auto' : 'none';
      if (c.inert === live) c.inert = !live;   // keep invisible CTAs out of the tab order
    }

    const cur = SEGMENTS[ci];
    const near = clamp(cur.kind === 'dive' ? cur.si
      : (((y - cur.start) / (cur.end - cur.start)) > 0.5 ? cur.si + 1 : cur.si), 0, N - 1);
    if (near !== activeIndex) {
      activeIndex = near;
      dots.forEach((d, k) => {
        d.classList.toggle('is-active', k === near);
        if (k === near) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
      nav.querySelectorAll('.sw-nav__item').forEach((n, k) => {
        n.classList.toggle('is-active', k === near);
        if (k === near) n.setAttribute('aria-current', 'true'); else n.removeAttribute('aria-current');
      });
      container.style.setProperty('--sw-accent', SECTIONS[near].accent || '');
    }
    scrollbarFill.style.transform = `scaleX(${clamp(y / (totalW * vh))})`;
    hint.style.opacity = clamp(1 - y / (0.5 * vh));
    if (particles) particles.style.transform = `translate3d(0, ${-y * 0.05}px, 0)`;
    ticking = false;
  }

  // Single coalesced entry point into read(). Media events fire mid-frame and used
  // to call read() directly, re-entering it alongside the scroll handler.
  function scheduleRead() { if (!ticking && !dead) { ticking = true; requestAnimationFrame(read); } }

  let lastT = 0;
  function raf(now) {
    if (dead) return;
    // Frame-rate-independent smoothing. A fixed 0.18-per-frame lerp chases twice as
    // fast on a 120 Hz ProMotion screen as on a 60 Hz one and crawls in a throttled
    // tab; normalising by elapsed time makes the scrub feel the same everywhere.
    const dt = lastT ? Math.min(now - lastT, 100) : 16.7;
    lastT = now;
    const k = reduce ? 1 : 1 - Math.pow(1 - 0.18, dt / 16.7);
    // Phones get a coarser grid: every seek is a decode, and their decoders are the
    // ones that fall over first.
    const step = isMobile() ? FRAME * 2 : FRAME;
    for (let i = 0; i < NSEG; i++) {
      const s = SEGMENTS[i];
      if (!s.hasClip || !s.ready || !s.video) continue;
      if (!s.visible && Math.abs(s.cur - s.target) < 0.002) continue;
      // Order matters: the lerp advances unconditionally and only the SEEK waits for
      // the decoder. Gating the lerp on `seeking` too would freeze the position
      // exactly while it is being scrubbed hardest, leaving the scene lagging behind
      // the scrollbar and drifting on after the user stops.
      s.cur += (s.target - s.cur) * k;
      if (s.video.seeking) continue;
      const dur = s.video.duration || 1;
      // Quantise to the source frame grid and dedupe: seeking to a time inside the
      // frame already on screen costs a full decode and paints nothing. A threshold
      // finer than one frame saturates the decoder and keeps `seeking` permanently true.
      const t = Math.round(clamp(s.cur, 0, 0.999) * dur / step) * step;
      if (t !== s.lastSeek) {
        s.lastSeek = t;
        try { s.video.currentTime = t; } catch (e) {}
      }
    }
    requestAnimationFrame(raf);
  }

  // iOS needs a user gesture before a muted video will decode/paint reliably. On the
  // first touch we prime every loaded clip (muted play→pause) so the first seek is
  // instant instead of showing a blank frame. `userReady` also makes freshly-loaded
  // clips prime themselves (see loadClip).
  let userReady = false;
  function primeVideo(v) {
    if (!isMobile() || !v) return;
    try { const p = v.play(); if (p && p.then) p.then(() => { try { v.pause(); } catch (e) {} }).catch(() => {}); }
    catch (e) {}
  }
  function onFirstGesture() {
    if (userReady) return;
    userReady = true;
    SEGMENTS.forEach(s => primeVideo(s.video));
  }
  window.addEventListener('pointerdown', onFirstGesture, { once: true, passive: true });
  window.addEventListener('touchstart', onFirstGesture, { once: true, passive: true });

  // Particles are a per-frame cost we can't afford alongside video scrubbing on a phone.
  seedParticles(particles, reduce || coarse);

  // The engine paints the document canvas from --sw-bg, but --sw-bg is declared on
  // .sw-root (this container), so on <html> it resolved to the built-in LIGHT
  // fallback — a cream canvas under a black page, visible wherever the fixed sky
  // does not reach (rubber-band overscroll, scrollbar gutter, first paint). Copy the
  // container's resolved value up to the root so html/body actually match the scene.
  const rootBg = getComputedStyle(container).getPropertyValue('--sw-bg').trim();
  if (rootBg) document.documentElement.style.setProperty('--sw-bg', rootBg);

  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(read); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  // Mobile browsers fire `resize` every time the URL bar slides in/out. Re-running
  // layout() there rebuilds the track height and yanks the scroll position, so on
  // touch we ignore height-only changes and only relayout when the width actually
  // changes (rotation still comes through orientationchange). layout() records the
  // width it laid out at.
  function onResize() {
    if (window.innerWidth === laidOutW) {
      // Height-only change. On touch that is the URL bar; on desktop it is DevTools
      // or a toolbar. Either way, relaying out would rescale the whole track and
      // teleport the visitor. Just let the tail grow to cover the taller viewport.
      if (window.innerHeight > maxVH) { maxVH = window.innerHeight; track.style.height = trackHeight() + 'px'; }
      return;
    }
    layout();
  }
  const onOrientation = () => layout();
  const onLoad = () => layout();
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onOrientation);
  window.addEventListener('load', onLoad);
  layout(false);
  requestAnimationFrame(raf);

  // Teardown for SPA/React use: stops the rAF loop, detaches window listeners,
  // and empties the container. The injected #sw-css style tag stays (injectCSS
  // guards on its id, so a remount reuses it).
  function destroy() {
    dead = true;
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('orientationchange', onOrientation);
    window.removeEventListener('load', onLoad);
    window.removeEventListener('pointerdown', onFirstGesture);
    window.removeEventListener('touchstart', onFirstGesture);
    // Release every decoder, blob and in-flight request before dropping the DOM.
    // Emptying the container alone leaves the downloads running and the object URLs
    // pinned, so a remount (StrictMode double-mount, Fast Refresh, locale change)
    // would stack a second copy of the whole chain on the first.
    SEGMENTS.forEach(releaseClip);
    // --sw-bg stays on <html> deliberately. injectCSS() guards on its id, so the
    // stylesheet (including `html{background:var(--sw-bg,#F5EDE0)}`) outlives this
    // teardown; clearing the variable would drop html back to the engine's LIGHT
    // default and flash a cream canvas on the next client-side route.
    container.classList.remove('sw-root');
    container.innerHTML = '';
  }
  return destroy;

  // ---- helpers ----
  function el(tag, cls) { const n = document.createElement(tag); if (cls) n.className = cls; return n; }
  function pad(n) { return String(n).padStart(2, '0'); }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function ctaBtns(cta) {
    let h = '';
    if (cta.primary) h += `<a class="sw-btn sw-btn--primary" href="${esc(cta.primary.href || '#')}">${esc(cta.primary.label)}</a>`;
    if (cta.secondary) h += `<a class="sw-btn sw-btn--ghost" href="${esc(cta.secondary.href || '#')}">${esc(cta.secondary.label)}</a>`;
    return h;
  }
}

function seedParticles(host, reduce) {
  if (!host || reduce) return;
  const kinds = ['dot', 'dot', 'ring'];
  const seeds = [7, 23, 41, 58, 71, 88, 12, 34, 52, 66, 83, 95, 18, 29, 47, 63, 77, 91, 5, 38, 55, 69, 82, 97];
  for (let k = 0; k < 20; k++) {
    const s = document.createElement('span');
    s.className = 'sw-pt sw-pt--' + kinds[k % kinds.length];
    s.style.left = seeds[k % seeds.length] + 'vw';
    s.style.top = ((seeds[(k * 3) % seeds.length] * 1.3) % 100) + 'vh';
    s.style.setProperty('--sw-sc', (0.5 + ((seeds[(k * 5) % seeds.length] % 60) / 60) * 1.1).toFixed(2));
    const dur = 14 + (seeds[(k * 7) % seeds.length] % 22);
    s.style.animationDuration = dur + 's';
    s.style.animationDelay = (-(seeds[(k * 2) % seeds.length] % dur)) + 's';
    host.appendChild(s);
  }
}

function injectCSS() {
  if (document.getElementById('sw-css')) return;
  const css = `
  .sw-root{--sw-bg:#F5EDE0;--sw-ink:#241d2b;--sw-ink-soft:#6a6072;--sw-accent:#8a7bb5;--sw-on-accent:#fff;
    --sw-font-display:ui-rounded,"SF Pro Rounded","Segoe UI",system-ui,sans-serif;
    --sw-font-body:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,system-ui,sans-serif;
    color:var(--sw-ink);font-family:var(--sw-font-body);flex:none;}
  html{margin:0;background:var(--sw-bg,#F5EDE0);overflow-x:hidden;}
  body{margin:0;background:var(--sw-bg,#F5EDE0);}
  .sw-sky{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none;background:var(--sw-bg);}
  .sw-sky__grad{position:absolute;inset:-10%;background:linear-gradient(178deg,color-mix(in srgb,var(--sw-accent) 12%,var(--sw-bg)) 0%,var(--sw-bg) 55%,color-mix(in srgb,var(--sw-accent) 6%,var(--sw-bg)) 100%);}
  .sw-sky__glow{position:absolute;inset:0;background:radial-gradient(60% 42% at 74% 16%,color-mix(in srgb,var(--sw-accent) 22%,transparent),transparent 70%),radial-gradient(46% 34% at 50% 50%,color-mix(in srgb,#fff 45%,transparent),transparent 70%);}
  .sw-particles{position:absolute;inset:-6% -2%;will-change:transform;}
  .sw-pt{position:absolute;width:13px;height:13px;transform:scale(var(--sw-sc,1));opacity:0;animation:sw-drift linear infinite;}
  .sw-pt::before{content:"";position:absolute;inset:0;border-radius:50%;}
  .sw-pt--dot::before{background:radial-gradient(circle at 34% 30%,color-mix(in srgb,var(--sw-accent) 60%,#000),#000 82%);}
  .sw-pt--ring::before{background:transparent;border:2px solid color-mix(in srgb,var(--sw-accent) 55%,transparent);}
  @keyframes sw-drift{0%{opacity:0;transform:scale(var(--sw-sc)) translate(0,12vh) rotate(0)}12%{opacity:.5}88%{opacity:.45}100%{opacity:0;transform:scale(var(--sw-sc)) translate(4vw,-22vh) rotate(210deg)}}
  .sw-scrollbar{position:fixed;top:0;left:0;right:0;height:3px;z-index:60;background:color-mix(in srgb,var(--sw-accent) 14%,transparent);}
  .sw-scrollbar span{display:block;height:100%;width:100%;transform-origin:0 50%;transform:scaleX(0);background:var(--sw-accent);}
  .sw-topbar{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:clamp(14px,2.4vw,26px) clamp(18px,5vw,64px);}
  .sw-brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--sw-ink);}
  .sw-brand__mark{width:24px;height:28px;border-radius:7px 7px 10px 10px;background:linear-gradient(160deg,var(--sw-accent),color-mix(in srgb,var(--sw-accent) 60%,#000));box-shadow:0 6px 14px color-mix(in srgb,var(--sw-accent) 40%,transparent);}
  .sw-brand__name{font-family:var(--sw-font-display);font-weight:700;font-size:1.1rem;}
  /* Surfaces are mixed from --sw-bg, not from a hardcoded #fff: a translucent white
     lozenge is invisible-to-illegible on a dark theme (measured 1.22:1 for the
     resting label). Mixing from the theme background keeps the same look on a light
     page and inverts correctly on a dark one. */
  .sw-nav{display:flex;gap:4px;padding:5px;background:color-mix(in srgb,var(--sw-bg) 72%,transparent);backdrop-filter:blur(10px);border:1px solid color-mix(in srgb,var(--sw-accent) 22%,transparent);border-radius:999px;}
  .sw-nav__item{font:inherit;font-size:.82rem;color:var(--sw-ink-soft);border:0;background:transparent;cursor:pointer;padding:7px 14px;border-radius:999px;transition:color .25s,background .25s;}
  .sw-nav__item:hover{color:var(--sw-ink);} .sw-nav__item.is-active{color:var(--sw-on-accent,#fff);background:var(--sw-accent);}
  .sw-topcta{text-decoration:none;font-weight:600;font-size:.9rem;color:#fff;background:var(--sw-ink);padding:10px 20px;border-radius:999px;white-space:nowrap;}
  .sw-stage{position:fixed;inset:0;z-index:10;pointer-events:none;}
  .sw-scene{position:absolute;inset:0;opacity:0;overflow:hidden;will-change:opacity;}
  .sw-scene__video,.sw-scene__still{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 42%;}
  .sw-scene__still{will-change:transform;} .sw-scene.has-clip .sw-scene__still{opacity:0;} .sw-scene__video{z-index:1;}
  .sw-copylayer{position:fixed;inset:0;z-index:20;pointer-events:none;}
  .sw-copylayer::before{content:"";position:absolute;inset:0;width:min(58vw,780px);background:linear-gradient(90deg,var(--sw-bg) 0%,color-mix(in srgb,var(--sw-bg) 82%,transparent) 34%,color-mix(in srgb,var(--sw-bg) 40%,transparent) 62%,transparent 100%);}
  /* The parallax offset arrives as --sw-copy-shift and is COMPOSED here with the
     centring transform, so read() never has to write the transform property itself
     and drop the -50%. Any breakpoint restyling .sw-copy must re-apply the shift. */
  .sw-copy{position:absolute;left:clamp(18px,5vw,64px);top:50%;transform:translateY(calc(-50% + var(--sw-copy-shift,0vh)));width:min(42vw,460px);opacity:0;will-change:opacity,transform;}
  .sw-copy__num{font-family:ui-monospace,Menlo,monospace;font-size:.74rem;letter-spacing:.12em;color:var(--sw-ink-soft);}
  .sw-copy__eyebrow{display:block;margin-top:18px;font-family:var(--sw-font-display);font-weight:700;font-size:.8rem;letter-spacing:.16em;text-transform:uppercase;color:var(--sw-accent);}
  .sw-copy__title{font-family:var(--sw-font-display);font-weight:700;color:var(--sw-ink);font-size:clamp(2rem,4.4vw,3.5rem);line-height:1.03;margin:12px 0 0;letter-spacing:-.01em;text-shadow:0 2px 20px color-mix(in srgb,var(--sw-bg) 70%,transparent);}
  .sw-copy__body{margin-top:18px;font-size:clamp(1rem,1.25vw,1.14rem);line-height:1.55;color:color-mix(in srgb,var(--sw-ink) 78%,var(--sw-ink-soft));max-width:40ch;text-shadow:0 1px 12px color-mix(in srgb,var(--sw-bg) 90%,transparent);}
  .sw-copy__tags{list-style:none;display:flex;flex-wrap:wrap;gap:8px;margin:24px 0 0;padding:0;}
  .sw-copy__tags li{font-size:.82rem;font-weight:600;color:color-mix(in srgb,var(--sw-accent) 82%,var(--sw-ink));padding:7px 14px;border-radius:999px;background:color-mix(in srgb,var(--sw-accent) 16%,var(--sw-bg));border:1px solid color-mix(in srgb,var(--sw-accent) 38%,transparent);}
  .sw-copy__cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px;pointer-events:auto;}
  .sw-btn{text-decoration:none;font-weight:600;font-size:.95rem;padding:13px 24px;border-radius:999px;transition:transform .2s;}
  .sw-btn--primary{color:#fff;background:var(--sw-ink);} .sw-btn--primary:hover{transform:translateY(-2px);}
  .sw-btn--ghost{color:var(--sw-ink);border:1.5px solid color-mix(in srgb,var(--sw-ink) 25%,transparent);} .sw-btn--ghost:hover{transform:translateY(-2px);}
  .sw-route{position:fixed;right:clamp(14px,2.4vw,30px);top:50%;z-index:40;transform:translateY(-50%);display:flex;flex-direction:column;gap:22px;padding:18px 10px;}
  .sw-route::before{content:"";position:absolute;left:50%;top:22px;bottom:22px;width:2px;transform:translateX(-50%);background:var(--sw-accent);opacity:.28;}
  .sw-route__dot{position:relative;border:0;background:transparent;cursor:pointer;width:14px;height:14px;display:grid;place-items:center;}
  .sw-route__dot i{width:9px;height:9px;border-radius:50%;background:color-mix(in srgb,var(--sw-accent) 40%,transparent);transition:transform .3s,background .3s,box-shadow .3s;}
  .sw-route__dot:hover i{transform:scale(1.25);background:var(--sw-accent);}
  .sw-route__dot.is-active i{background:var(--sw-accent);transform:scale(1.4);box-shadow:0 0 0 5px color-mix(in srgb,var(--sw-accent) 22%,transparent);}
  .sw-route__label{position:absolute;right:24px;top:50%;transform:translateY(-50%) translateX(6px);white-space:nowrap;font-size:.78rem;font-weight:600;color:var(--sw-ink);background:color-mix(in srgb,var(--sw-bg) 85%,transparent);backdrop-filter:blur(6px);padding:5px 11px;border-radius:999px;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;border:1px solid color-mix(in srgb,var(--sw-accent) 24%,transparent);}
  .sw-route__dot:hover .sw-route__label,.sw-route__dot.is-active .sw-route__label{opacity:1;transform:translateY(-50%) translateX(0);}
  /* No opacity transition: read() drives this per frame, and a 300 ms transition on
     top of a per-frame write just smears it ~0.6 behind the actual scroll. */
  .sw-hint{position:fixed;left:50%;bottom:26px;z-index:30;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;color:var(--sw-ink-soft);}
  .sw-hint i{width:22px;height:34px;border-radius:12px;border:2px solid color-mix(in srgb,var(--sw-ink) 28%,transparent);position:relative;}
  .sw-hint i::after{content:"";position:absolute;left:50%;top:7px;width:4px;height:7px;border-radius:2px;background:var(--sw-accent);transform:translateX(-50%);animation:sw-wheel 1.7s ease-in-out infinite;}
  @keyframes sw-wheel{0%{opacity:0;top:6px}40%{opacity:1}100%{opacity:0;top:17px}}
  .sw-track{position:relative;z-index:1;width:100%;pointer-events:none;}
  @media (max-width:860px){
    .sw-nav{display:none;}
    /* Taller, denser scrim: measured alpha under the copy was only 0.13-0.39, so the
       section number, eyebrow and headline sat on raw video. */
    .sw-copylayer::before{width:100%;height:78%;top:auto;bottom:0;background:linear-gradient(0deg,var(--sw-bg) 10%,color-mix(in srgb,var(--sw-bg) 88%,transparent) 38%,color-mix(in srgb,var(--sw-bg) 55%,transparent) 66%,transparent 100%);}
    /* Anchor copy to the bottom, clear of the home indicator / collapsing URL bar AND
       of the scroll hint (they overlapped by 12px at 375x667). The right inset also
       keeps the text out of the route rail, which occupies the right ~46px.
       env() is on BOTH declarations so a browser without dvh still gets safe-area. */
    .sw-copy{left:clamp(18px,5vw,64px);right:clamp(46px,12vw,72px);top:auto;bottom:calc(clamp(96px,17vh,150px) + env(safe-area-inset-bottom));transform:translateY(var(--sw-copy-shift,0vh));width:auto;max-width:560px;}
    .sw-copy{bottom:calc(clamp(96px,17dvh,150px) + env(safe-area-inset-bottom));}
    .sw-copy__title{font-size:clamp(1.9rem,7.5vw,2.7rem);}
    .sw-copy__body{max-width:none;font-size:clamp(.98rem,3.6vw,1.1rem);} .sw-scene__video,.sw-scene__still{object-position:center 46%;}
    .sw-hint{bottom:calc(20px + env(safe-area-inset-bottom));}
    .sw-route{gap:16px;right:6px;}
    /* Visually hidden, NOT display:none — display:none strips the dot's only
       accessible name. (An explicit aria-label is also set in JS.) */
    .sw-route__label{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;opacity:0;}
  }
  /* Portrait phones crop a 16:9 clip hard; keep the framing centred so the focal
     subject (which the camera dives toward) stays in view. */
  @media (max-width:860px) and (orientation:portrait){
    .sw-scene__video,.sw-scene__still{object-position:center 44%;}
  }
  /* Touch: give the route dots a finger-sized hit area without growing the visible dot. */
  @media (hover:none) and (pointer:coarse){
    .sw-route{padding:14px 6px;}
    .sw-route__dot{width:28px;height:28px;}
    .sw-btn{padding:15px 26px;}
  }
  @media (prefers-reduced-motion:reduce){ .sw-hint i::after{animation:none;} .sw-pt{display:none;} }
  `;
  // Vendored change: injected UNLAYERED (upstream wraps in `@layer sw`).
  // This project's reset.css applies `all: unset` via an unlayered `*:where()`
  // rule, and unlayered author styles always beat layered ones — the layer
  // wrapper would let the reset nuke the whole engine UI. Unlayered, the
  // engine's class selectors win on specificity, and the page's overrides in
  // global.css (`.sw-root .foo`) still win over the engine's (`.foo`).
  const style = document.createElement('style'); style.id = 'sw-css';
  style.textContent = css;
  document.head.appendChild(style);
}

// Vendored for this project: exported as ESM (was CJS/global dual export).
export { mountScrollWorld };
