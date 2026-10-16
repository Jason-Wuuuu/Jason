import { useRef, useState } from "react";
import site from "../content";

const { typingLine: TARGET, typingRecord: RECORD } = site.profile;

const BURST = Array.from({ length: 16 }, (_, i) => ({
  a: i * 22.5 + ((i * 37) % 15),
  d: 70 + ((i * 53) % 70),
}));

export default function TypeTest({ autoFocus }) {
  const [typed, setTyped] = useState("");
  const [wpm, setWpm] = useState(null);
  const start = useRef(0);
  const input = useRef(null);

  const onChange = (e) => {
    const v = e.target.value.slice(0, TARGET.length);
    if (!start.current) start.current = performance.now();
    setTyped(v);
    if (v.length === TARGET.length) {
      const minutes = (performance.now() - start.current) / 60000;
      setWpm(Math.round(TARGET.length / 5 / minutes));
    }
  };

  const reset = () => {
    start.current = 0;
    setTyped("");
    setWpm(null);
    input.current.focus();
  };

  const done = wpm !== null;
  return (
    <div className="typetest">
      <label htmlFor="tt" className="tt-hint">
        Type this line. Jason's record is {RECORD} WPM.
      </label>
      <div className="tt-line" onClick={() => input.current.focus()}>
        {[...TARGET].map((ch, i) => (
          <span
            key={i}
            className={
              i >= typed.length ? "" : typed[i] === ch ? "ok" : "bad"
            }
            data-cursor={i === typed.length && !done}
          >
            {ch}
          </span>
        ))}
        <input
          id="tt"
          ref={input}
          value={typed}
          onChange={onChange}
          disabled={done}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
      <p className="tt-result" aria-live="polite">
        {done && (
          <span className="burst" aria-hidden="true">
            {BURST.map((b, i) => (
              <i key={i} style={{ "--a": `${b.a}deg`, "--d": `${b.d}px` }} />
            ))}
          </span>
        )}
        {done
          ? wpm > 300
            ? "That wasn't typing. Try again by hand."
            : `${wpm} WPM. ${wpm >= RECORD ? "You beat him." : "Not bad."}`
          : " "}
        {done && (
          <button className="link" onClick={reset}>
            Try again
          </button>
        )}
      </p>
    </div>
  );
}
