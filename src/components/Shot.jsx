import { forwardRef } from "react";
import { image } from "../App";

// A project screenshot: a looping silent video for .mp4 (a screen recording is ~15x smaller than the same GIF), an <img> otherwise.
const Shot = forwardRef(({ src, alt, loading, ...rest }, ref) =>
  src.endsWith(".mp4")
    ? <video ref={ref} src={image(src)} aria-label={alt} autoPlay loop muted playsInline preload="metadata" {...rest} />
    : <img ref={ref} src={image(src)} alt={alt} loading={loading} {...rest} />);
export default Shot;
