// Minimal GitHub contents/trees client. The token never leaves the browser except to api.github.com.
const API = "https://api.github.com";
const IMG_DIR = "public/images/";

const utf8Decode = (b64) =>
  new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)));
const utf8Encode = (str) => {
  let bin = "";
  for (const b of new TextEncoder().encode(str)) bin += String.fromCharCode(b);
  return btoa(bin);
};

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(",")[1]);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

export function client({ repo, branch, token }) {
  const req = async (path, opts = {}) => {
    const res = await fetch(API + path, {
      ...opts,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        ...opts.headers,
      },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`${res.status}: ${body.message || res.statusText}`);
    return body;
  };
  const file = (path) => `/repos/${repo}/contents/${path.split("/").map(encodeURIComponent).join("/")}`;
  const write = (path, content, message, sha) =>
    req(file(path), {
      method: "PUT",
      body: JSON.stringify({ message, content, branch, sha }),
    });

  return {
    // Fine-grained tokens may omit `permissions`; only an explicit false is a refusal.
    verify: () => req(`/repos/${repo}`).then((r) => r.permissions?.push !== false),
    async readJson(path) {
      const f = await req(`${file(path)}?ref=${encodeURIComponent(branch)}`);
      return { data: JSON.parse(utf8Decode(f.content)), sha: f.sha };
    },
    async saveJson(path, data, sha, message) {
      const r = await write(path, utf8Encode(JSON.stringify(data, null, 2) + "\n"), message, sha);
      return r.content.sha;
    },
    async listImages() {
      const t = await req(`/repos/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
      return t.tree
        .filter((n) => n.type === "blob" && n.path.startsWith(IMG_DIR) && /\.(png|jpe?g|gif|webp|svg)$/i.test(n.path))
        .map((n) => ({ path: n.path.slice(IMG_DIR.length), sha: n.sha }));
    },
    async uploadImage(path, base64) {
      const r = await write(IMG_DIR + path, base64, `Add image ${path}`);
      return { path, sha: r.content.sha };
    },
    deleteImage: (path, sha) =>
      req(file(IMG_DIR + path), {
        method: "DELETE",
        body: JSON.stringify({ message: `Delete image ${path}`, sha, branch }),
      }),
    rawUrl: (path) => `https://raw.githubusercontent.com/${repo}/${branch}/${IMG_DIR}${path}`,
  };
}
