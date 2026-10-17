import { forwardRef } from "react";
import { image } from "../App";

// A project screenshot: a looping silent video for .mp4 (a screen recording is ~15x smaller than the same GIF), an <img> otherwise.
const fast = (e) => { e.currentTarget.defaultPlaybackRate = e.currentTarget.playbackRate = 1.5; }; // demos run at 1.5x everywhere
const ready = (e) => { e.currentTarget.dataset.ok = ""; }; // until this is set, the pixel loading checkerboard shows (index.css)

const Shot = forwardRef(({ src, alt, loading, onLoad, ...rest }, ref) =>
  src.endsWith(".mp4")
    ? <video ref={ref} src={image(src)} aria-label={alt} autoPlay loop muted playsInline preload="metadata" onLoadedMetadata={fast} onLoadedData={ready} {...rest} />
    : <img ref={ref} src={image(src)} alt={alt} loading={loading} onLoad={(e) => { ready(e); onLoad?.(e); }} {...rest} />);
export default Shot;
