// What the admin can edit. `type`: text | number | bool | area | select | lines | image | images | list.
// `lines` is one array entry per line (or per blank-line-separated block with sep "\n\n").
export const sections = [
  {
    key: "profile",
    label: "Profile",
    fields: [
      { key: "name", label: "Display name (split into lines in the hero)", type: "text" },
      { key: "fullName", label: "Full name (footer)", type: "text" },
      { key: "tagline", label: "Tagline", type: "area" },
      { key: "typingLine", label: "Typing-test line", type: "text" },
      { key: "typingRecord", label: "Your typing record (WPM)", type: "number" },
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
      { key: "date", label: "Dates", type: "text" },
      { key: "points", label: "Bullet points (one per line)", type: "lines" },
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
      { key: "course", label: "Context (e.g. Side, NLP Course)", type: "text" },
      { key: "category", label: "Category (filter tab)", type: "text" },
      { key: "tech_stack", label: "Tech stack", type: "text" },
      { key: "description", label: "Description", type: "area" },
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
      { key: "paragraphs", label: "Paragraphs (blank line between; [text](url) makes a link)", type: "lines", sep: "\n\n" },
      { key: "image", label: "Photo", type: "image" },
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
