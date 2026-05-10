const { useState, useEffect, useRef, useCallback } = React;

/* =======================================================================
   Data
   ======================================================================= */

const TRACKS = [
{ id: 't1', title: 'Raga Yaman at Dusk', artist: 'Bansuri · Tabla', glyph: '۞', duration: 318, origin: 'India', duration_hint: '5:18', audio: '', c1: 'oklch(0.50 0.14 50)', c2: 'oklch(0.26 0.10 25)' },
{ id: 't7', title: 'Yaman Sandhya', artist: 'Bansuri · Tanpura', glyph: '✣', duration: 318, origin: 'India', duration_hint: '5:18', audio: '', c1: 'oklch(0.48 0.13 45)', c2: 'oklch(0.24 0.09 20)' },
{ id: 't2', title: 'Sitar Dreamroom', artist: 'Sitar · Tanpura', glyph: '❋', duration: 342, origin: 'India', duration_hint: '5:42', audio: '', c1: 'oklch(0.52 0.12 30)', c2: 'oklch(0.26 0.10 350)' },
{ id: 't8', title: 'Bhupali Tanpura Path', artist: 'Sitar · Tanpura', glyph: '❄', duration: 342, origin: 'India', duration_hint: '5:42', audio: '', c1: 'oklch(0.50 0.13 40)', c2: 'oklch(0.25 0.10 15)' },
{ id: 't3', title: 'Oud Nights in Fez', artist: 'Oud · Qanun', glyph: '✵', duration: 264, origin: 'Arabic', duration_hint: '4:24', audio: '', c1: 'oklch(0.42 0.11 35)', c2: 'oklch(0.22 0.08 15)' },
{ id: 't9', title: 'Courtyard Hijaz', artist: 'Oud · Qanun', glyph: '✸', duration: 264, origin: 'Arabic', duration_hint: '4:24', audio: '', c1: 'oklch(0.43 0.10 25)', c2: 'oklch(0.22 0.08 10)' },
{ id: 't4', title: 'Qanun Courtyard', artist: 'Ney · Oud', glyph: '✺', duration: 288, origin: 'Arabic', duration_hint: '4:48', audio: '', c1: 'oklch(0.44 0.11 35)', c2: 'oklch(0.24 0.09 20)' },
{ id: 't10', title: 'Bayati Garden', artist: 'Ney · Oud', glyph: '❂', duration: 288, origin: 'Arabic', duration_hint: '4:48', audio: '', c1: 'oklch(0.45 0.12 40)', c2: 'oklch(0.24 0.09 25)' },
{ id: 't5', title: 'Koto Rain on Cedar', artist: 'Koto · Shakuhachi', glyph: '◈', duration: 296, origin: 'Japan', duration_hint: '4:56', audio: '', c1: 'oklch(0.48 0.09 160)', c2: 'oklch(0.24 0.07 200)' },
{ id: 't11', title: 'Ame no Kotoji', artist: 'Koto · Shakuhachi', glyph: '◊', duration: 296, origin: 'Japan', duration_hint: '4:56', audio: '', c1: 'oklch(0.50 0.08 180)', c2: 'oklch(0.24 0.07 210)' },
{ id: 't6', title: 'Shakuhachi Mist', artist: 'Shakuhachi · Koto', glyph: '◉', duration: 312, origin: 'Japan', duration_hint: '5:12', audio: '', c1: 'oklch(0.46 0.09 165)', c2: 'oklch(0.22 0.07 195)' },
{ id: 't12', title: 'Temple Wind Path', artist: 'Shakuhachi · Koto', glyph: '❖', duration: 312, origin: 'Japan', duration_hint: '5:12', audio: '', c1: 'oklch(0.46 0.08 170)', c2: 'oklch(0.22 0.07 200)' }];


const STATIONS = [
{ id: 's1', name: 'Raga & Bansuri', cat: 'India', bpm: '68 BPM', listeners: '2,184', desc: 'Evening ragas, bamboo flute, slow tabla. Generated fresh, played without end.', c1: 'oklch(0.50 0.14 50)', c2: 'oklch(0.26 0.10 25)' },
{ id: 's2', name: 'Oud & Qanun', cat: 'Arabic', bpm: '72 BPM', listeners: '1,472', desc: 'Maqam-based improvisations. The courtyard, a fountain, nothing urgent.', c1: 'oklch(0.44 0.11 35)', c2: 'oklch(0.22 0.08 15)' },
{ id: 's3', name: 'Koto & Shakuhachi', cat: 'Japan', bpm: '60 BPM', listeners: '3,056', desc: 'Plucked strings and bamboo breath. Suited to long afternoons and clean desks.', c1: 'oklch(0.48 0.09 160)', c2: 'oklch(0.24 0.07 200)' }];


/* =======================================================================
   Icons
   ======================================================================= */

const Icon = {
  Play: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>,
  Pause: () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>,
  Prev: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zM9.5 12l8.5 6V6z" /></svg>,
  Next: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" /></svg>,
  Shuffle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5" /><path d="M4 20L21 3" /><path d="M21 16v5h-5" /><path d="M15 15l6 6" /><path d="M4 4l5 5" /></svg>,
  Repeat: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2l4 4-4 4" /><path d="M3 11v-1a4 4 0 014-4h14" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v1a4 4 0 01-4 4H3" /></svg>,
  Vol: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" /><path d="M15.54 8.46a5 5 0 010 7.07" /><path d="M19.07 4.93a10 10 0 010 14.14" /></svg>,
  Heart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>,
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 8h16M4 16h16" /></svg>,
  Arrow: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
};

/* =======================================================================
   Helpers
   ======================================================================= */

const fmt = (s) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

/* =======================================================================
   Flow Visual — animated waveform canvas overlay
   ======================================================================= */

function useFlowCanvas(enabled, emberColor) {
  const rafRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = document.getElementById('flowCanvas');
    if (!canvas) return;
    canvas.style.opacity = enabled ? '1' : '0';
    if (!enabled) {cancelAnimationFrame(rafRef.current);return;}

    const ctx = canvas.getContext('2d');
    let running = true;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Palette-aware color — re-read CSS var each frame
    const getColor = () => {
      // ember is oklch — convert to a draw-friendly rgba by overlaying on a known bg
      // Simple approach: use a warm gold that works across all palettes, tinted per-palette
      return { r: 255, g: 200, b: 120 };
    };

    const draw = (ts) => {
      if (!running) return;
      timeRef.current = ts * 0.0004;
      const t = timeRef.current;
      const W = canvas.width,H = canvas.height;
      const { r, g, b } = getColor();

      ctx.clearRect(0, 0, W, H);

      const WAVES = 6;
      for (let w = 0; w < WAVES; w++) {
        const phase = w / WAVES * Math.PI * 2;
        const freq = 0.003 + w * 0.0008;
        const amp = H * (0.04 + w * 0.018);
        const yBase = H * (0.2 + w * 0.12);
        const speed = 0.6 + w * 0.25;
        const alpha = 0.07 - w * 0.009;

        const pts = [];
        for (let x = 0; x <= W; x += 3) {
          pts.push([x,
          yBase +
          Math.sin(x * freq + t * speed + phase) * amp +
          Math.sin(x * freq * 1.7 + t * speed * 0.5 + phase * 2) * amp * 0.4]
          );
        }

        // fill below wave
        ctx.beginPath();
        pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
        ctx.lineTo(W, H);ctx.lineTo(0, H);ctx.closePath();
        const grad = ctx.createLinearGradient(0, yBase - amp, 0, yBase + amp * 2);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.fill();

        // stroke the wave line
        ctx.beginPath();
        pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 3})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [enabled]);
}

/* =======================================================================
   Nav
   ======================================================================= */

function Nav() {
  return (
    <nav className="top" data-screen-label="Nav">
      <div className="logo">Instrumental<span className="logo-accent">Flow</span><sup>®</sup></div>
      <div className="navlinks">
        <a href="#" className="active">Now Flowing</a>
        <a href="#stations">Traditions</a>
        <a href="#how">How it works</a>
        <a href="#sessions">Sessions</a>
        <a href="#">Sign in</a>
      </div>
      <button className="btn-glass liquid-glass">
        <span className="live-dot"></span>
        Enter the Flow
      </button>
    </nav>);

}

/* =======================================================================
   Hero
   ======================================================================= */

function Hero({ onPlay, playing }) {
  return (
    <section className="hero" data-screen-label="Hero">
      <div className="eyebrow fr liquid-glass">
        <span className="spark"></span>
        AI-generated · streaming continuously · never the same twice
      </div>
      <h1 className="headline fr-1" style={{ fontFamily: "sans-serif" }}>
        Instrumentals <em>from</em> <em className="ember">every</em> corner<br />
        of the <em>world</em>, flowing endlessly.
      </h1>
      <p className="sub fr-2">
        Raga, oud, koto — generated fresh by AI and streamed without interruption.
        No vocals, no ads, no repeats. Three living traditions, shaped for focus.
      </p>
      <div className="hero-ctas fr-3">
        <button className="btn-ember" onClick={onPlay}>
          {playing ? 'Pause the flow' : 'Start the flow'}
        </button>
        <button className="btn-glass lg liquid-glass">
          Explore traditions
        </button>
      </div>
    </section>);

}

/* =======================================================================
   Ticker
   ======================================================================= */

function Ticker() {
  const items = [
  'Now flowing — Raga Yaman at Dusk',
  'Up next — Oud Nights in Fez',
  '3 traditions · 12 pieces · streaming',
  'AI-generated · no loops · no repeats',
  'Instrumentals only · no vocals · no ads',
  'Session length — 00:42:17',
  'Chapter IV — East of the River'];

  const line =
  <>
      {items.map((t, i) =>
    <span key={i}>{t}<span className="bullet"></span></span>
    )}
    </>;

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        {line}
        {line}
      </div>
    </div>);

}

/* =======================================================================
   Player
   ======================================================================= */

function Player({ tracks, index, setIndex, playing, setPlaying, progress, setProgress, volume, setVolume }) {
  const track = tracks[index];
  const progressRef = useRef(null);

  const skip = (dir) => {
    setProgress(0);
    setIndex((index + dir + tracks.length) % tracks.length);
  };

  const onScrub = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    setProgress(Math.max(0, Math.min(1, x)) * track.duration);
  };

  return (
    <section className="player-section" data-screen-label="Player">
      <div className="player liquid-glass">
        {/* artwork */}
        <div className="artwork" style={{ background: `linear-gradient(135deg, ${track.c1}, ${track.c2})` }}>
          <div className="art-overlay"></div>
          <div className="art-rings"></div>
          <div className="art-glyph">{track.glyph}</div>
        </div>

        {/* center: track info + controls */}
        <div className="track-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="cat">{track.origin} · generated just now</div>
            {playing && <div className="eq" aria-hidden="true"><span /><span /><span /><span /></div>}
          </div>
          <h2>{track.title}</h2>
          <div className="artist">{track.artist} · Instrumental Flow AI</div>

          <div className="progress-row">
            <span className="progress-time">{fmt(progress)}</span>
            <div className="progress" ref={progressRef} onClick={onScrub}>
              <div className="progress-fill" style={{ width: `${progress / track.duration * 100}%` }}>
                <div className="progress-thumb"></div>
              </div>
            </div>
            <span className="progress-time" style={{ textAlign: 'right' }}>{fmt(track.duration)}</span>
          </div>

          <div className="player-controls">
            <button className="ctrl" aria-label="Shuffle"><Icon.Shuffle /></button>
            <button className="ctrl" aria-label="Previous" onClick={() => skip(-1)}><Icon.Prev /></button>
            <button className="ctrl play" aria-label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying(!playing)}>
              {playing ? <Icon.Pause /> : <Icon.Play />}
            </button>
            <button className="ctrl" aria-label="Next" onClick={() => skip(1)}><Icon.Next /></button>
            <button className="ctrl" aria-label="Repeat"><Icon.Repeat /></button>

            <div className="vol-row">
              <Icon.Vol />
              <div className="vol-slider" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                setVolume(Math.max(0, Math.min(1, x)));
              }}>
                <div className="vol-fill" style={{ width: `${volume * 100}%` }}></div>
              </div>
              <button className="ctrl" aria-label="Favorite"><Icon.Heart /></button>
            </div>
          </div>
        </div>

        {/* right: queue */}
        <div className="queue">
          <div className="queue-head">
            <span>Up next</span>
            <span>{tracks.length} tracks</span>
          </div>
          {tracks.map((t, i) =>
          <div
            key={t.id}
            className={`qitem ${i === index ? 'active' : ''}`}
            onClick={() => {setIndex(i);setProgress(0);setPlaying(true);}}>
            
              <div className="q-num">{i === index && playing ? <Icon.Play /> : String(i + 1).padStart(2, '0')}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="q-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                <div className="q-artist">{t.artist}</div>
              </div>
              <div className="q-dur">{fmt(t.duration)}</div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* =======================================================================
   Stations
   ======================================================================= */

function Stations({ onSelect }) {
  return (
    <section className="stations" id="stations" data-screen-label="Stations">
      <div className="section-head">
        <div>
          <span className="label">§ 02 — Traditions</span>
          <h3>Three traditions, <em>one</em> endless flow.</h3>
        </div>
        <p>
          Each tradition is its own living stream — generated continuously from the melodic language of its region. Drop in, drift between them, stay as long as you need.
        </p>
      </div>
      <div className="station-grid">
        {STATIONS.map((s, i) =>
        <div
          key={s.id}
          className="station"
          style={{ '--c1': s.c1, '--c2': s.c2, animationDelay: `${i * 60}ms` }}
          onClick={() => onSelect(i)}>
          
            <div className="st-bg"></div>
            <div className="st-top">
              <span className="st-cat">{s.cat}</span>
              <span className="st-bpm">{s.bpm}</span>
            </div>
            <div>
              <h4>{s.name}</h4>
              <p className="st-desc">{s.desc}</p>
            </div>
            <div className="st-footer">
              <span className="st-listeners"><span className="dot"></span>{s.listeners} in the flow</span>
              <button className="st-play" aria-label={`Play ${s.name}`}><Icon.Play /></button>
            </div>
          </div>
        )}
      </div>
    </section>);

}

/* =======================================================================
   Features
   ======================================================================= */

function HowItWorks() {
  const steps = [
  { n: '01', t: 'Choose a tradition.', p: 'Three regional palettes — Indian raga, Arabic oud, Japanese koto. Each one is its own continuous stream.' },
  { n: '02', t: 'The AI composes live.', p: 'A fine-tuned model generates new passages in real time, grounded in the melodic grammar of that tradition.' },
  { n: '03', t: 'Flow, uninterrupted.', p: 'No ads, no repeats, no vocals. Stay for a Pomodoro or a full workday — the music keeps arriving.' }];

  return (
    <section className="howitworks" id="how" data-screen-label="HowItWorks">
      <div className="section-head">
        <div>
          <span className="label">§ 03 — How it works</span>
          <h3>Composed <em>on the fly,</em><br />shaped by <em className="ember">tradition.</em></h3>
        </div>
        <p>
          Instrumental Flow is an AI system — trained on the scales, modes, and ornamentation of living musical traditions. It doesn't loop samples. It plays.
        </p>
      </div>
      <div className="how-grid">
        {steps.map((s) =>
        <div className="how-card liquid-glass" key={s.n}>
            <div className="how-n">{s.n}</div>
            <div>
              <h5>{s.t}</h5>
              <p>{s.p}</p>
            </div>
          </div>
        )}
      </div>
    </section>);

}

/* =======================================================================
   Features
   ======================================================================= */

function Features() {
  const feats = [
  { n: '01', t: 'Generated, never repeated.', p: 'Every session is composed in real time. You never hear the same piece twice.' },
  { n: '02', t: 'Instruments only.', p: 'No vocals, no lyrics, no language barrier. Just the instrument speaking.' },
  { n: '03', t: 'Three living traditions.', p: 'Indian raga, Arabic oud, and Japanese koto — each generated in its own melodic grammar.' },
  { n: '04', t: 'One uninterrupted flow.', p: 'Switch traditions or let it drift. Either way, the music never stops and nothing interrupts.' }];

  return (
    <section className="features" id="sessions" data-screen-label="Features">
      <div className="features-grid">
        {feats.map((f) =>
        <div className="feat" key={f.n}>
            <div className="fnum">{f.n}</div>
            <h5>{f.t}</h5>
            <p>{f.p}</p>
          </div>
        )}
      </div>
    </section>);

}

/* =======================================================================
   Footer
   ======================================================================= */

function Footer() {
  return (
    <footer data-screen-label="Footer">
      <div className="foot-grid">
        <div className="foot-brand">
          <div className="logo">Instrumental<span className="logo-accent">Flow</span><sup>®</sup></div>
          <p className="foot-tag">An endless stream of AI-generated world instrumentals for work, study, and rest. Three traditions, one continuous flow.</p>
        </div>
        <div className="foot-col">
          <h6>Listen</h6>
          <a href="#">Traditions</a>
          <a href="#">Now flowing</a>
          <a href="#">Daily chapter</a>
          <a href="#">Session timer</a>
        </div>
        <div className="foot-col">
          <h6>About</h6>
          <a href="#">How it's made</a>
          <a href="#">The AI model</a>
          <a href="#">Attribution & ethics</a>
          <a href="#">Request a tradition</a>
        </div>
        <div className="foot-col">
          <h6>Elsewhere</h6>
          <a href="#">Changelog</a>
          <a href="#">Newsletter</a>
          <a href="#">API</a>
          <a href="#">Contact</a>
        </div>
      </div>
      <div className="foot-bot">
        <span>© 2026 Instrumental Flow · AI-composed, forever streaming.</span>
        <span>Chapter I — Three Roads · 3 traditions · ∞</span>
      </div>
    </footer>);

}

/* =======================================================================
   App
   ======================================================================= */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "saffron",
  "flow": false,
  "displayFont": "Instrument Serif",
  "grainAmount": 0.18,
  "headlineAccent": "ember"
} /*EDITMODE-END*/;

const PALETTES = {
  saffron: {
    bg: 'oklch(0.20 0.04 42)', bgDeep: 'oklch(0.13 0.035 42)',
    ember: 'oklch(0.80 0.16 58)', muted: 'oklch(0.65 0.015 50)',
    dim: 'oklch(0.42 0.018 45)', border: 'oklch(0.28 0.018 42)',
    atm1: 'oklch(0.30 0.10 42 / 0.70)', atm2: 'oklch(0.26 0.10 340 / 0.55)', atm3: 'oklch(0.18 0.04 42)',
    aurora1: 'oklch(0.55 0.16 55 / 0.22)', aurora2: 'oklch(0.50 0.14 330 / 0.20)', aurora3: 'oklch(0.45 0.12 25 / 0.18)'
  },
  indigo: {
    bg: 'oklch(0.17 0.05 265)', bgDeep: 'oklch(0.10 0.04 265)',
    ember: 'oklch(0.78 0.14 215)', muted: 'oklch(0.62 0.015 240)',
    dim: 'oklch(0.40 0.018 250)', border: 'oklch(0.26 0.018 260)',
    atm1: 'oklch(0.28 0.10 265 / 0.70)', atm2: 'oklch(0.24 0.09 300 / 0.55)', atm3: 'oklch(0.15 0.04 265)',
    aurora1: 'oklch(0.50 0.14 240 / 0.22)', aurora2: 'oklch(0.45 0.12 290 / 0.20)', aurora3: 'oklch(0.40 0.10 210 / 0.18)'
  },
  teal: {
    bg: 'oklch(0.18 0.04 190)', bgDeep: 'oklch(0.11 0.03 190)',
    ember: 'oklch(0.78 0.14 165)', muted: 'oklch(0.62 0.015 185)',
    dim: 'oklch(0.40 0.018 190)', border: 'oklch(0.26 0.018 190)',
    atm1: 'oklch(0.28 0.09 190 / 0.70)', atm2: 'oklch(0.24 0.08 220 / 0.55)', atm3: 'oklch(0.15 0.04 190)',
    aurora1: 'oklch(0.50 0.13 175 / 0.22)', aurora2: 'oklch(0.45 0.11 210 / 0.20)', aurora3: 'oklch(0.40 0.10 150 / 0.18)'
  },
  plum: {
    bg: 'oklch(0.17 0.05 320)', bgDeep: 'oklch(0.10 0.04 320)',
    ember: 'oklch(0.80 0.15 350)', muted: 'oklch(0.62 0.015 310)',
    dim: 'oklch(0.40 0.018 320)', border: 'oklch(0.26 0.018 320)',
    atm1: 'oklch(0.28 0.10 320 / 0.70)', atm2: 'oklch(0.24 0.09 280 / 0.55)', atm3: 'oklch(0.15 0.04 320)',
    aurora1: 'oklch(0.50 0.14 340 / 0.22)', aurora2: 'oklch(0.45 0.12 290 / 0.20)', aurora3: 'oklch(0.40 0.11 10 / 0.18)'
  }
};

const FONTS = {
  'Instrument Serif': "'Instrument Serif', serif",
  'Fraunces': "'Fraunces', serif",
  'PT Serif': "'PT Serif', serif"
};

function TweaksLauncher() {
  const open = () => {
    // Dispatch the same message the host toolbar sends; the TweaksPanel listens for it.
    window.postMessage({ type: '__activate_edit_mode' }, '*');
  };
  return (
    <button
      onClick={open}
      className="tweaks-launcher liquid-glass"
      aria-label="Open tweaks panel"
      title="Customize the page">
      
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
      <span>Customize</span>
    </button>);

}

function App() {
  const [tweaks, _setTweak] = useTweaks(TWEAK_DEFAULTS);
  useFlowCanvas(tweaks.flow);
  // useTweaks expects (key, val) but we call it with an object — wrap it
  const setTweaks = React.useCallback((obj) => {
    Object.entries(obj).forEach(([k, v]) => _setTweak(k, v));
  }, [_setTweak]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [tracks, setTracks] = useState(TRACKS);
  const audioARef = useRef(null);
  const audioBRef = useRef(null);
  const [activeIsA, setActiveIsA] = useState(true);
  const fadeRafRef = useRef(null);
  const crossfadingRef = useRef(false);
  const CROSSFADE_SECONDS = 4;

  const seekTo = useCallback((t) => {
    setProgress(t);
    const a = activeIsA ? audioARef.current : audioBRef.current;
    if (a && a.src) {
      try { a.currentTime = t; } catch (e) {}
    }
  }, [activeIsA]);

  // Load track URLs from tracks.json so you can edit URLs without touching code.
  // Accepts Drive share URLs (auto-converts) or any direct audio URL.
  useEffect(() => {
    const driveToStream = (url) => {
      if (!url) return '';
      const m = url.match(/\/file\/d\/([^/]+)/);
      if (m) return `https://drive.google.com/uc?export=download&id=${m[1]}`;
      return url;
    };
    fetch('tracks.json')
      .then((r) => r.ok ? r.json() : null)
      .then((cfg) => {
        if (!cfg) return;
        setTracks((prev) => prev.map((t) =>
          cfg[t.id] ? { ...t, audio: driveToStream(cfg[t.id]) } : t
        ));
      })
      .catch(() => {});
  }, []);

  // Sync active audio with current track + play state.
  // Cancels any in-flight crossfade so manual skips don't leave the standby ringing.
  useEffect(() => {
    if (fadeRafRef.current) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
    if (crossfadingRef.current) {
      const standby = activeIsA ? audioBRef.current : audioARef.current;
      if (standby) { standby.pause(); standby.volume = volume; }
      crossfadingRef.current = false;
    }

    const a = activeIsA ? audioARef.current : audioBRef.current;
    if (!a) return;
    const url = tracks[index]?.audio;
    if (!url) {
      a.pause();
      a.removeAttribute('src');
      return;
    }
    if (!a.src.endsWith(url)) {
      a.src = url;
    }
    a.volume = volume;
    if (playing) {
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  }, [index, playing, tracks, activeIsA]);

  // Volume sync — active only, and only when not mid-crossfade.
  useEffect(() => {
    const a = activeIsA ? audioARef.current : audioBRef.current;
    if (a && !crossfadingRef.current) a.volume = volume;
  }, [volume, activeIsA]);

  // Time/end events. timeupdate triggers a crossfade in the last CROSSFADE_SECONDS of the track.
  useEffect(() => {
    const a = activeIsA ? audioARef.current : audioBRef.current;
    if (!a) return;

    const onTime = () => {
      setProgress(a.currentTime);
      const dur = a.duration;
      if (!isFinite(dur) || crossfadingRef.current) return;
      if (dur - a.currentTime > CROSSFADE_SECONDS) return;

      const nextIdx = (index + 1) % tracks.length;
      const nextUrl = tracks[nextIdx]?.audio;
      if (!nextUrl) return; // can't crossfade — let `ended` advance normally

      const s = activeIsA ? audioBRef.current : audioARef.current;
      if (!s) return;

      s.src = nextUrl;
      s.volume = 0;
      s.play().catch(() => {});
      crossfadingRef.current = true;

      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / (CROSSFADE_SECONDS * 1000));
        a.volume = volume * (1 - t);
        s.volume = volume * t;
        if (t < 1) {
          fadeRafRef.current = requestAnimationFrame(tick);
        } else {
          a.pause();
          a.volume = volume;
          crossfadingRef.current = false;
          fadeRafRef.current = null;
          setActiveIsA((prev) => !prev);
          setIndex(nextIdx);
          setProgress(0);
        }
      };
      fadeRafRef.current = requestAnimationFrame(tick);
    };

    const onEnd = () => {
      // Backstop — track shorter than fade window or next has no URL.
      if (!crossfadingRef.current) {
        setProgress(0);
        setIndex((i) => (i + 1) % tracks.length);
      }
    };

    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', onEnd);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('ended', onEnd);
    };
  }, [activeIsA, index, tracks, volume]);

  // Auto-sync duration from real audio metadata into tracks state
  useEffect(() => {
    const a = activeIsA ? audioARef.current : audioBRef.current;
    if (!a) return;
    const onMeta = () => {
      if (!isFinite(a.duration) || a.duration <= 0) return;
      setTracks((prev) => prev.map((t, i) =>
        i === index ? { ...t, duration: Math.floor(a.duration) } : t
      ));
    };
    a.addEventListener('loadedmetadata', onMeta);
    return () => a.removeEventListener('loadedmetadata', onMeta);
  }, [index, activeIsA]);

  useEffect(() => {
    const p = PALETTES[tweaks.palette] || PALETTES.saffron;
    const r = document.documentElement;
    r.style.setProperty('--bg', p.bg);
    r.style.setProperty('--bg-deep', p.bgDeep);
    r.style.setProperty('--ember', p.ember);
    r.style.setProperty('--muted', p.muted);
    r.style.setProperty('--dim', p.dim);
    r.style.setProperty('--border', p.border);
    r.style.setProperty('--atm1', p.atm1);
    r.style.setProperty('--atm2', p.atm2);
    r.style.setProperty('--atm3', p.atm3);
    r.style.setProperty('--aurora1', p.aurora1);
    r.style.setProperty('--aurora2', p.aurora2);
    r.style.setProperty('--aurora3', p.aurora3);
    r.style.setProperty('--font-display', FONTS[tweaks.displayFont] || FONTS['Instrument Serif']);
    const grain = document.querySelector('.grain');
    if (grain) grain.style.opacity = tweaks.grainAmount;
    // flow canvas handled by useFlowCanvas hook
  }, [tweaks]);

  // load extra fonts lazily
  useEffect(() => {
    if (document.getElementById('extra-fonts')) return;
    const l = document.createElement('link');
    l.id = 'extra-fonts';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=PT+Serif:ital,wght@0,400;1,400&display=swap';
    document.head.appendChild(l);
  }, []);

  // fake playback ticker — only used when track has no real audio URL
  useEffect(() => {
    if (!playing) return;
    if (tracks[index].audio) return;
    const id = setInterval(() => {
      setProgress((p) => {
        const dur = tracks[index].duration;
        if (p + 1 >= dur) {setIndex((i) => (i + 1) % tracks.length);return 0;}
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, index, tracks]);

  const selectStation = (i) => {
    const station = STATIONS[i];
    const firstIdx = tracks.findIndex((t) => t.origin === station.cat);
    if (firstIdx === -1) return;
    setIndex(firstIdx);
    setProgress(0);
    setPlaying(true);
    window.scrollTo({ top: document.querySelector('.player-section').offsetTop - 40, behavior: 'smooth' });
  };

  return (
    <>
      <audio ref={audioARef} preload="metadata" />
      <audio ref={audioBRef} preload="metadata" />
      <Nav />
      <Hero onPlay={() => setPlaying((p) => !p)} playing={playing} />
      <Ticker />
      <Player
        tracks={tracks}
        index={index} setIndex={setIndex}
        playing={playing} setPlaying={setPlaying}
        progress={progress} setProgress={seekTo}
        volume={volume} setVolume={setVolume} />

      <Stations onSelect={selectStation} />
      <HowItWorks />
      <Features />
      <Footer />

      <TweaksLauncher />

      <TweaksPanel title="Instrumental Flow">
        <TweakSection title="Atmosphere">
          <TweakRadio
            label="Palette"
            value={tweaks.palette}
            onChange={(v) => setTweaks({ palette: v })}
            options={[
            { value: 'saffron', label: 'Saffron' },
            { value: 'indigo', label: 'Indigo' },
            { value: 'teal', label: 'Teal' },
            { value: 'plum', label: 'Plum' }]
            } />
          
          <TweakToggle
            label="Music flow overlay"
            value={tweaks.flow}
            onChange={(v) => setTweaks({ flow: v })} />
          
          <TweakSlider
            label="Film grain"
            value={tweaks.grainAmount} min={0} max={0.6} step={0.02}
            onChange={(v) => setTweaks({ grainAmount: v })} />
          
        </TweakSection>
        <TweakSection title="Type">
          <TweakSelect
            label="Display font"
            value={tweaks.displayFont}
            onChange={(v) => setTweaks({ displayFont: v })}
            options={['Instrument Serif', 'Fraunces', 'PT Serif']} />
          
        </TweakSection>
      </TweaksPanel>
    </>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);