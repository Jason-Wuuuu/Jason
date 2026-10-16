import site from "./content/site.json";

export default site;

// "[text](url)" → <a>. The only markup the admin's text fields support.
export const withLinks = (text) =>
  text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    return m ? (
      <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer">
        {m[1]}
      </a>
    ) : (
      part
    );
  });
