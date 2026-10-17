import raw from "./content/site.json";

// Items ticked "Archived" in the admin stay in site.json but never reach the site.
const hide = (v) =>
  Array.isArray(v)
    ? v.filter((x) => !x?.archived).map(hide)
    : v && typeof v === "object"
      ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, hide(x)]))
      : v;
// The admin's local preview iframe shows unsaved edits, handed over through sessionStorage (the key is cleared on Save).
const draft = () => {
  try {
    return window.self !== window.top && JSON.parse(sessionStorage.getItem("admin.preview"));
  } catch {
    return null;
  }
};
const site = hide(draft() || raw);

export default site;

// Inline markup: [text](url), **bold**, *italic*. "[text](#typing)" is the typing-game easter egg: a button that calls onEgg.
export const withLinks = (text, { onEgg, eggOpen } = {}) =>
  text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.length > 4) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m && m[2] === "#typing" && !onEgg) return m[1]; // egg switched off: plain text, not a dead link
    if (m && m[2] === "#typing" && onEgg)
      return (
        <button key={i} type="button" className="egg" aria-expanded={!!eggOpen} onClick={onEgg}>
          {m[1]}
        </button>
      );
    return m ? (
      <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer">
        {m[1]}
      </a>
    ) : (
      part
    );
  });

// Tiny markdown for text fields: blank line = new paragraph, a line break stays a line break,
// lines starting "- " become a bullet list (also right under a text line), plus the inline markup above.
// Rendered as React nodes (no innerHTML).
const BUL = /^\s*[-*•] /;
export const Md = ({ text = "", ...opts }) =>
  text.split(/\n\s*\n/).flatMap((block, i) => {
    const runs = []; // consecutive lines of the same kind: [isBullet, lines]
    for (const l of block.split("\n").filter((l) => l.trim())) {
      const b = BUL.test(l);
      if (runs.at(-1)?.[0] === b) runs.at(-1)[1].push(l);
      else runs.push([b, [l]]);
    }
    return runs.map(([b, lines], j) =>
      b ? (
        <ul key={`${i}.${j}`}>
          {lines.map((l, k) => (
            <li key={k}>{withLinks(l.replace(BUL, ""), opts)}</li>
          ))}
        </ul>
      ) : (
        <p key={`${i}.${j}`}>
          {lines.map((l, k) => (
            <span key={k}>
              {k > 0 && <br />}
              {withLinks(l, opts)}
            </span>
          ))}
        </p>
      ),
    );
  });
