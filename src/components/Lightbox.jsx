import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { image } from "../App";
import Shot from "./Shot";
import { Win } from "./Windows";

const RATES = [0.5, 1, 1.5, 2];
let rate = 1.5; // the speed picked in the viewer, kept for the session (the demos start at 1.5x)
const clock = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
// Play/pause, a scrub lane and the time for a video in the viewer, in the page's pixel style (the browser's own controls would look out of place). The gallery keeps its plain looping preview.
function VideoBar({ video }) {
  const [t, setT] = useState({ at: 0, len: 0, playing: true });
  const [speed, setSpeed] = useState(rate);
  useEffect(() => {
    const v = video.current;
    const sync = () => setT({ at: v.currentTime, len: v.duration || 0, playing: !v.paused });
    const apply = () => { v.defaultPlaybackRate = v.playbackRate = rate; }; // after Shot's own 1.5x, which runs on the same event first
    const evs = ["timeupdate", "loadedmetadata", "play", "pause", "seeked"];
    evs.forEach((e) => v.addEventListener(e, sync));
    v.addEventListener("loadedmetadata", apply);
    apply();
    sync();
    return () => { evs.forEach((e) => v.removeEventListener(e, sync)); v.removeEventListener("loadedmetadata", apply); };
  }, [video]);
  const faster = () => { // 0.5x, 1x, 1.5x, 2x, round again
    rate = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
    video.current.defaultPlaybackRate = video.current.playbackRate = rate;
    setSpeed(rate);
  };
  const seekTo = (s) => { video.current.currentTime = Math.min(t.len, Math.max(0, s)); };
  const seek = (e) => { const r = e.currentTarget.getBoundingClientRect(); seekTo(((e.clientX - r.left) / r.width) * t.len); };
  const p = t.len ? t.at / t.len : 0;
  return (
    <div className="vbar" data-on={t.playing}>
      <button className="vplay" data-on={t.playing} aria-label={t.playing ? "Pause" : "Play"} onClick={() => (video.current.paused ? video.current.play() : video.current.pause())} />
      <div
        className="vlane"
        role="slider"
        tabIndex={0}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(t.len)}
        aria-valuenow={Math.round(t.at)}
        aria-valuetext={`${clock(t.at)} of ${clock(t.len)}`}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); seek(e); }}
        onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && seek(e)}
        onKeyDown={(e) => { if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); e.stopPropagation(); seekTo(t.at + (e.key === "ArrowLeft" ? -2 : 2)); } }} // not the viewer's previous/next shot
      >
        <span className="vfill" style={{ width: `${p * 100}%` }} />
        <span className="vgrip" style={{ left: `${p * 100}%` }} />
      </div>
      <span className="vtime">{clock(t.at)} / {clock(t.len)}</span>
      <button className="vrate" onClick={faster} aria-label={`Speed ${speed} times, change`}>{speed}×</button>
    </div>
  );
}

// A project screenshot at full size. On desktop it is a draggable window like Settings and Contact (no backdrop, the page stays usable; Esc or × closes). On phones it is the full-screen viewer: click or tap anywhere (but a video, which has its own controls) to close; a swipe or the prev/next buttons move between shots.
// Arrow keys move between shots in both. A fixed div rather than a <dialog>: the top layer would sit above the pixel cursor, which is a page element.
export default function Lightbox({ shots, captions, title, at, onAt, onClose }) {
  const box = useRef(null);
  const pic = useRef(null);
  const x0 = useRef(0);
  const n = shots.length;
  const cap = captions?.[at];
  const [win] = useState(() => matchMedia("(min-width: 701px) and (hover: hover)").matches);
  useEffect(() => {
    if (win) return;
    const opener = document.activeElement;
    box.current.focus();
    return () => opener?.focus?.();
  }, []);
  // Every shot sits in the same 16:10 box (almost all are 1440x900), so the viewer never changes size; an enlarged small shot (a GIF) keeps its crisp pixels.
  const fit = (img) => { img.dataset.up = img.naturalWidth < img.clientWidth; };
  useEffect(() => { if (pic.current.complete) fit(pic.current); }, [at]);
  // The gallery behind is lazy, so a shot scrolled off-screen isn't fetched yet: warm both neighbours so prev is as quick as next.
  useEffect(() => { [at - 1, at + 1].forEach((i) => shots[i] && !shots[i].endsWith(".mp4") && (new Image().src = image(shots[i]))); }, [at, shots]);
  const step = (d) => at + d >= 0 && at + d < n && onAt(at + d);
  const keys = { Escape: onClose, ArrowLeft: () => step(-1), ArrowRight: () => step(1) };
  // The window isn't modal, so it listens on the page instead of on itself (Esc is the window's own).
  useEffect(() => {
    if (!win) return;
    const arrows = (e) => keys[e.key] && e.key !== "Escape" && !e.target.closest?.("input, textarea") && (e.preventDefault(), keys[e.key]());
    addEventListener("keydown", arrows);
    return () => removeEventListener("keydown", arrows);
  });
  const bar = shots[at].endsWith(".mp4") && <VideoBar key={`bar ${shots[at]}`} video={pic} />; // its own key: sharing the shot's would make React duplicate the video // over the video in the window (the buttons below stay put), in the nav row on phones
  const nav = (
    <div className="zoom-nav">
      <button className="zoom-n zoom-p" disabled={at === 0} onClick={() => step(-1)} aria-label="Previous screenshot" />
      {!win && bar}
      {n > 1 && <span className="zoom-c" aria-hidden="true">{at + 1} / {n}</span>}
      <button className="zoom-n zoom-f" disabled={at === n - 1} onClick={() => step(1)} aria-label="Next screenshot" />
    </div>
  );
  if (win)
    return createPortal(
      <Win cls="shotwin" title={[title, cap, n > 1 && `${at + 1}/${n}`].filter(Boolean).join(" · ")} onClose={onClose}>
        <Shot key={shots[at]} ref={pic} src={shots[at]} alt={`${title} screenshot`} onLoad={(e) => fit(e.currentTarget)} />
        {bar}
        {n > 1 && nav}
      </Win>,
      document.body,
    );
  return createPortal(
    <div
      ref={box}
      className="zoom"
      role="dialog"
      aria-modal="true"
      aria-label={`${title}, screenshot ${at + 1} of ${n}`}
      tabIndex={-1}
      onKeyDown={(e) => keys[e.key] && (e.preventDefault(), keys[e.key]())}
      onClick={(e) => !e.target.closest("button, video, .vbar") && onClose()}
      onTouchStart={(e) => (x0.current = e.target.closest(".vbar") ? null : e.touches[0].clientX)} // scrubbing is not a swipe
      onTouchEnd={(e) => { if (x0.current == null) return; const d = e.changedTouches[0].clientX - x0.current; if (Math.abs(d) > 50) step(d < 0 ? 1 : -1); }}
    >
      <Shot key={shots[at]} ref={pic} src={shots[at]} alt={`${title} screenshot`} onLoad={(e) => fit(e.currentTarget)} />
      {cap && <p className="zoom-cap">{cap}</p>}
      <button className="zoom-x" onClick={onClose} aria-label="Close">×</button>
      {nav}
    </div>,
    document.body,
  );
}
