# Instrumental Flow — Backlog & Resume Notes

_Last updated: 2026-05-07. Pause reason: Suno appears down. Resume when service is back._

---

## Project overview

A landing page for **Instrumental Flow** — an AI-generated world-instrumentals streaming experience. Started from a Claude Design handoff bundle, scoped down to **3 traditions** for v1.

**Three traditions in scope:**
- **India** — raga (bansuri/tabla) + sitar (tanpura)
- **Arabic** — oud + qanun + ney
- **Japan** — koto + shakuhachi

---

## Files in the project

```
instrumental-flow/
├── index.html          # Page shell, CSS, React mount
├── app.jsx             # Main React app — components, audio engine, state
├── tweaks-panel.jsx    # Reusable tweaks/customize panel
├── tracks.json         # Audio URL config (paste Suno URLs here)
└── backlog.md          # This file
```

---

## What's done

### Design + content
- [x] Trimmed from 9 traditions to 3 (India, Arabic, Japan)
- [x] 6 tracks defined (2 per tradition) — see TRACKS in `app.jsx`
- [x] 3 stations defined — see STATIONS in `app.jsx`
- [x] All "Nine traditions" copy updated to "Three" (hero, stations, how-it-works, features, footer, ticker)
- [x] Branding remains "Instrumental Flow" — AI-generated, focus/study positioning

### Player engine
- [x] Real `<audio>` playback (was fake progress bar)
- [x] Two `<audio>` elements (A/B) for crossfade
- [x] **4-second crossfade** between tracks on auto-advance (`CROSSFADE_SECONDS` in `app.jsx`)
- [x] Manual next/prev = instant skip, cancels any in-flight fade
- [x] Auto-advance fallback when track has no URL or is shorter than fade window
- [x] Volume slider syncs to active element
- [x] Progress bar scrubs the audio (`audio.currentTime = t`)
- [x] **Auto-duration sync** — reads real `audio.duration` on `loadedmetadata` and updates the track, so progress bar maxes correctly

### Config
- [x] `tracks.json` external config — paste URLs without editing JSX
- [x] Drive share URLs auto-convert to streaming format (`/file/d/.../view` → `?export=download&id=...`)
- [x] Falls back gracefully if `tracks.json` is missing
- [x] **Requires running a local server** — `fetch('tracks.json')` doesn't work over `file://`

### Tweaks panel (already worked from handoff)
- [x] 4 palettes — Saffron / Indigo / Teal / Plum (full-page color shift)
- [x] Music flow waveform overlay toggle
- [x] Film grain slider
- [x] Display font swap (Instrument Serif / Fraunces / PT Serif)

---

## What's pending (resume here)

### Blocker: Suno is down

Once Suno is back, the only remaining work is **content generation**:

1. Open Suno Pro → Custom mode → leave lyrics empty, paste each prompt below into Style
2. Generate 4–6 versions per prompt; keep the best
3. Download MP3s
4. Upload to Google Drive, set "Anyone with the link can view"
5. Paste each share URL into `tracks.json` against the matching track ID
6. Run `python3 -m http.server 8000` from the project directory
7. Open `http://localhost:8000` — crossfade flow should work end-to-end

### Suno prompts (the upgraded immersive set)

**`t1` — Raga Yaman at Dusk (India)**
> Hindustani classical, evening Raga Yaman, slow alaap-style bansuri over sustained tanpura drone, gentle tabla entering after a minute in slow teental, warm intimate temple recording, twilight contemplative atmosphere, no vocals, no Western harmony, no chord progressions, traditional

**`t2` — Sitar Dreamroom (India)**
> Hindustani classical, drone-forward sitar in Raga Bhupali, slow exploratory meend and gamak ornamentation, continuous tanpura drone, no tabla, deeply meditative, intimate close-mic with natural room reverb, no vocals, no rhythm, traditional

**`t3` — Oud Nights in Fez (Arabic)**
> Arabic classical taqsim improvisation, oud and qanun in maqam Hijaz, slow rubato no fixed tempo, warm North African courtyard recording with distant water, contemplative midnight mood, no drums, no vocals, no Western chords, traditional

**`t4` — Qanun Courtyard (Arabic)**
> Middle Eastern instrumental, oud and ney flute duet in maqam Bayati, slow rubato, breath-forward ney with responsive oud, warm wood resonance, sunset garden ambience, no percussion, no vocals, no Western harmony, traditional

**`t5` — Koto Rain on Cedar (Japan)**
> Traditional Japanese sōkyoku, koto and shakuhachi in yō pentatonic, sparse meditative phrasing, long sustained breath tones, gentle koto plucks with natural resonance, temple atmosphere with distant rain, no vocals, no drums, no Western harmony

**`t6` — Shakuhachi Mist (Japan)**
> Solo shakuhachi honkyoku Zen meditation, very slow breath phrases with long silences, subtle koto accents in the distance, mountain temple morning ambience, faint wind, deeply contemplative, no rhythm, no vocals, traditional Japanese

### Why these prompts (vs. the first thin set)
- Specific scales/ragas/modes (Yaman, Bhupali, Hijaz, Bayati, yō pentatonic) anchor Suno away from Western tonality
- Specific techniques (alaap, taqsim, meend, gamak, honkyoku) push toward authentic phrasing
- Scene cues ("temple," "courtyard with distant water," "mountain morning") help the immersive feel
- Aggressive negatives ("no Western harmony," "no chord progressions," "no drums") fight Suno's pop-music defaults

### Curation expectation
- ~40% of generations will feel authentic
- ~40% passable
- ~20% wrong (drums sneak in, raga becomes pop, etc.)
- Listen on **headphones** — the immersive vs. fine gap shows up in low-end warmth, room decay, breath sound

---

## Key decisions made along the way

1. **Scope from 9 → 3 traditions.** Manageable Suno generation budget; 3 stations fit cleanly into the grid.
2. **Suno over ElevenLabs Music.** ElevenLabs Music isn't strong on niche world traditions; Suno Pro is better for instrumental world music and includes commercial rights.
3. **Pre-generate to storage, don't stream-generate per listener.** Generation latency + cost makes on-demand impossible. Pre-generate library + chain with crossfade = the "endless flow" feel without per-listener generation cost.
4. **Google Drive over local for v1 hosting.** No local storage available. Drive works with the workaround URL format for a small handful of samples; not production-grade but fine for prototyping.
5. **Kept the "AI-generated, never repeats" framing.** The fixed catalog isn't infinite, but with crossfade + shuffle it gives the illusion. Honest scope-down: not "infinite generation," just "continuous instrumental flow."

---

## Open questions / future enhancements (parked)

- **Shuffle mode** — currently the queue plays in TRACKS order. Could randomize (especially within a tradition) so the experience feels less repetitive.
- **Crossfade duration tweak** — `CROSSFADE_SECONDS = 4` is hardcoded. Could expose in the Customize panel.
- **More tracks per tradition.** 2 is thin. With more Suno generation budget, expand to 8–10 per tradition for a less-loopy feel.
- **Cloudflare R2 instead of Drive.** When ready to share publicly, move audio to R2 (10 GB free, no egress fees, S3-compatible). Drive throttling will bite on a real audience.
- **Legal review.** Suno is in active litigation with the RIAA. For a personal/portfolio project this is fine. Before charging users or doing real marketing, talk to a lawyer about AI-music commercial rights.
- **Real listener counts.** The station cards show fake numbers ("2,184 in the flow"). Either wire up a real count or change the copy to something honest.
- **Hardcoded track durations.** Auto-syncs once audio loads, but the *initial* TRACKS array still has placeholder durations. Could remove those entirely and let the metadata sync handle it.

---

## How to resume cleanly

1. Read this file top to bottom.
2. Check Suno status — generate when service is back.
3. Use the prompts in the section above. Don't re-derive them.
4. Workflow: generate → download → Drive share link → paste into `tracks.json`.
5. Test with `python3 -m http.server 8000` and `http://localhost:8000`.
6. If something doesn't work, the most likely failure is CORS / Drive URL throttling — see the "Caveats" notes in the conversation history (Drive may need re-uploads or a different host).

---

## Conversation arc (compressed)

For context if I (Claude) am resumed in a fresh session:

1. **Started** by implementing the design handoff (`index.html` + `app.jsx` + `tweaks-panel.jsx`) — a working prototype with all the design's interactivity.
2. User asked about **ElevenLabs** for streaming — flagged it's a generation API, not a streaming one, and quality is uneven on niche traditions. Recommended pre-generate-to-CDN architecture instead.
3. User considered **Suno + S3** — agreed it's the right approach. Flagged Pro tier needed for commercial rights, third-party API wrappers are brittle, RIAA litigation is real risk for commercial use.
4. User asked about **Google Drive for sample hosting** — works for prototyping with caveats (CORS, throttling, no range requests). Noted local storage was the simplest option but user didn't have space.
5. User considered **stopping the project** when realizing Drive samples wouldn't fulfill the "endless AI flow" promise. Pushed back gently — stopping is fine but Drive's limitations aren't a reason to kill it; rescoping the promise OR committing to Suno Pro infra are both legitimate paths.
6. User chose **Suno Pro + 3 traditions** scope. Trimmed data, copy, and grid to 3 traditions. Wired real `<audio>` playback. Added `tracks.json` config + auto-duration sync.
7. User questioned **prompt quality** for immersion. Upgraded prompts with specific scales/techniques/scene cues + aggressive negatives.
8. User added **crossfade**. Implemented 4s fade between tracks via dual `<audio>` elements + rAF volume ramp.
9. **Paused** — Suno is down.

The next message back from the user will likely be "Suno is back, I have URLs" or "I generated tracks, here are the links."
