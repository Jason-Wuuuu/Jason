import site from "./content/site.json";

export default site;

// "[text](url)" → <a>. The only markup the admin's text fields support.
// "[text](#typing)" is the typing-game easter egg: a button that calls onEgg.
export const withLinks = (text, { onEgg, eggOpen } = {}) =>
  text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
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
