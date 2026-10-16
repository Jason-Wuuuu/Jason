// What the admin can edit. `type`: text | number | bool | area | select | lines | daterange | image | images | list.
// `lines` is one array entry per line (or per blank-line-separated block with sep "\n\n").
import { AVATAR_STYLES } from "../avatar.js";
import { ICON_NAMES } from "../pixelicons.js";

export const sections = [
  {
    key: "profile",
    label: "Profile",
    fields: [
      { key: "name", label: "Display name (split into lines in the hero)", type: "text" },
      { key: "fullName", label: "Full name (footer)", type: "text" },
      { key: "tagline", label: "Tagline (Enter = line break, **bold**, *italic*, [text](url))", type: "area" },
      { key: "class", label: "Class (shown under the name on the hero card)", type: "text" },
      { key: "stats", label: "Skill bars (one per line, \"Name 8\" = 8 out of 10)", type: "lines" },
      { key: "typingLine", label: "Typing-test line", type: "text" },
      { key: "typingRecord", label: "Your typing record (WPM)", type: "number" },
      { key: "avatar", label: "Profile picture (upload any image; a transparent cut-out PNG keeps its shape, a photo is cropped round)", type: "image" },
      { key: "avatarStyle", label: "Pixel style", type: "select", options: Object.entries(AVATAR_STYLES).map(([v, s]) => [v, s.label]) },
      { key: "avatarFrame", label: "Frame", type: "select", options: [["round", "Round border (cropped to a circle, transparent inside)"], ["none", "No frame (cut-out silhouette)"]] },
      {
        key: "links",
        label: "Links",
        type: "list",
        titleKey: "label",
        fields: [
          { key: "label", label: "Label", type: "text" },
          { key: "href", label: "URL", type: "text" },
          { key: "icon", label: "Icon", type: "select", options: ["github", "linkedin", "resume", "other"] },
        ],
      },
    ],
  },
  {
    key: "experience",
    label: "Experience",
    list: true,
    titleKey: "role",
    fields: [
      { key: "role", label: "Role", type: "text" },
      { key: "company", label: "Company or school", type: "text" },
      { key: "place", label: "Place", type: "text" },
      { key: "date", label: "Dates", type: "daterange" },
      { key: "points", label: "Bullet points (one per line; start a line with \"- \" to nest it under the one above)", type: "lines" },
    ],
  },
  {
    key: "education",
    label: "Education",
    list: true,
    titleKey: "role",
    fields: [
      { key: "role", label: "Degree", type: "text" },
      { key: "company", label: "School", type: "text" },
      { key: "place", label: "Place", type: "text" },
      { key: "date", label: "Dates", type: "daterange" },
      { key: "points", label: "Bullet points (one per line; start a line with \"- \" to nest it under the one above)", type: "lines" },
    ],
  },
  {
    key: "projects",
    label: "Projects",
    list: true,
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "year", label: "Year", type: "text" },
      { key: "category", label: "Category (filter tab)", type: "text" },
      { key: "tech_stack", label: "Tech stack", type: "text" },
      { key: "description", label: "Description (blank line = new paragraph, \"- \" = bullet, **bold**, *italic*, [text](url))", type: "area" },
      { key: "githubUrl", label: "GitHub URL", type: "text" },
      { key: "demoUrl", label: "Demo URL (or a file in /public)", type: "text" },
      { key: "screenshots", label: "Screenshots", type: "images" },
      { key: "featured", label: "Featured (shown on the default tab)", type: "bool" },
    ],
  },
  {
    key: "about",
    label: "About",
    fields: [
      { key: "paragraphs", label: "Paragraphs (blank line between; - bullets, **bold**, *italic*, [text](url))", type: "lines", sep: "\n\n" },
      { key: "images", label: "Photos", type: "images", folder: "me" },
      { key: "funFact", label: "Fun fact (last line of the page; [text](#typing) opens the typing game)", type: "text" },
      {
        key: "hobbies",
        label: "Hobbies (shown as the Bag and Side Quests)",
        type: "list",
        titleKey: "name",
        fields: [
          { key: "name", label: "Name", type: "text" },
          { key: "icon", label: "Icon", type: "select", options: ICON_NAMES },
          { key: "line", label: "One line about it", type: "text" },
        ],
      },
    ],
  },
];

export const blank = (fields) =>
  Object.fromEntries(
    fields.map((f) => [f.key, f.type === "lines" || f.type === "images" || f.type === "list" ? [] : f.type === "number" ? 0 : f.type === "bool" ? false : ""]),
  );

// Drop empty strings from string arrays (editing "lines" keeps them while you type).
export const clean = (v) =>
  Array.isArray(v)
    ? v.every((x) => typeof x === "string")
      ? v.map((x) => x.trim()).filter(Boolean)
      : v.map(clean)
    : v && typeof v === "object"
      ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clean(x)]))
      : v;

const show = (v) => (Array.isArray(v) ? v.map(show).join(" / ") : v && typeof v === "object" ? JSON.stringify(v) : v === "" || v == null ? "(empty)" : String(v));
const fields = (a, b) =>
  [...new Set([...Object.keys(a), ...Object.keys(b)])]
    .filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]))
    .map((key) => ({ key, from: show(a[key]), to: show(b[key]) }));

// What differs between the saved content and the edited content, one entry per section / list item.
// List items are matched by identical content first, then by title, so inserting or moving one doesn't flag the rest.
export function changes(saved, now) {
  const out = [];
  for (const s of sections) {
    const a = saved[s.key], b = now[s.key];
    if (JSON.stringify(a) === JSON.stringify(b)) continue;
    if (!s.list) {
      out.push({ section: s.label, item: "", kind: "changed", fields: fields(a, b) });
      continue;
    }
    const k = JSON.stringify;
    const had = new Set(a.map(k)), has = new Set(b.map(k));
    const gone = a.filter((x) => !has.has(k(x)));
    const fresh = b.filter((x) => !had.has(k(x)));
    for (const n of fresh) {
      const i = gone.findIndex((o) => o[s.titleKey] === n[s.titleKey]);
      if (i < 0) out.push({ section: s.label, item: n[s.titleKey] || "(untitled)", kind: "added", fields: [] });
      else out.push({ section: s.label, item: n[s.titleKey] || "(untitled)", kind: "changed", fields: fields(gone.splice(i, 1)[0], n) });
    }
    for (const o of gone) out.push({ section: s.label, item: o[s.titleKey] || "(untitled)", kind: "removed", fields: [] });
    if (!fresh.length && !gone.length) out.push({ section: s.label, item: "", kind: "reordered", fields: [] });
  }
  return out;
}
