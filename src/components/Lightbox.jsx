import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { image } from "../App";
import Shot from "./Shot";

// A project screenshot at full size. Click or tap anywhere to close; arrows, the prev/next buttons (at the sides, or under the shot on phones) or a swipe move between shots.
// A fixed div rather than a <dialog>: the top layer would sit above the pixel cursor, which is a page element.
export default function Lightbox({ shots, title, at, onAt, onClose }) {
  const box = useRef(null);
  const pic = useRef(null);
  const x0 = useRef(0);
  const n = shots.length;
  useEffect(() => {
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
  return createPortal(
    <div
      ref={box}
      className="zoom"
      role="dialog"
      aria-modal="true"
      aria-label={`${title}, screenshot ${at + 1} of ${n}`}
      tabIndex={-1}
      onKeyDown={(e) => keys[e.key] && (e.preventDefault(), keys[e.key]())}
      onClick={(e) => !e.target.closest("button") && onClose()}
      onTouchStart={(e) => (x0.current = e.touches[0].clientX)}
      onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - x0.current; if (Math.abs(d) > 50) step(d < 0 ? 1 : -1); }}
    >
      <Shot ref={pic} src={shots[at]} alt={`${title} screenshot`} onLoad={(e) => fit(e.currentTarget)} />
      <button className="zoom-x" onClick={onClose} aria-label="Close">×</button>
      <div className="zoom-nav">
        <button className="zoom-n zoom-p" disabled={at === 0} onClick={() => step(-1)} aria-label="Previous screenshot" />
        {n > 1 && <span className="zoom-c" aria-hidden="true">{at + 1} / {n}</span>}
        <button className="zoom-n zoom-f" disabled={at === n - 1} onClick={() => step(1)} aria-label="Next screenshot" />
      </div>
    </div>,
    document.body,
  );
}
