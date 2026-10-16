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

// Dev-server stand-in (see localAdmin in vite.config.js): same interface, files on disk.
const local = () => {
  const req = async (path, method = "GET", body) => {
    const res = await fetch("/__local" + path, { method, body });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(j.message || res.statusText);
    return j;
  };
  return {
    verify: async () => true,
    readJson: async () => ({ data: JSON.parse((await req("/site")).text), sha: "" }),
    saveJson: async (_p, data) => (await req("/site", "PUT", JSON.stringify(data, null, 2) + "\n"), ""),
    listImages: () => req("/images"),
    uploadImage: async (path, base64) => (await req("/images/" + path, "PUT", base64), { path, sha: "" }),
    deleteImage: (path) => req("/images/" + path, "DELETE"),
    renameImage: async (from, to) => (await req("/rename", "POST", JSON.stringify({ from, to })), { path: to, sha: "" }),
    rawUrl: (path) => `/images/${path}`,
  };
};

export function client({ repo, branch, token, local: isLocal }) {
  if (isLocal) return local();
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
    if (!res.ok) throw Object.assign(new Error(`${res.status}: ${body.message || res.statusText}`), { status: res.status });
    return body;
  };
  // GitHub's 403 for a token that can read but not write is cryptic; say how to fix the token instead.
  const writing = (fn) => async (...args) => {
    try {
      return await fn(...args);
    } catch (e) {
      if (e.status !== 403 && e.status !== 401) throw e;
      throw new Error(
        `GitHub refused the change (${e.message}). This token can read ${repo} but not write to it. In GitHub go to ` +
          `Settings → Developer settings → Personal access tokens → Fine-grained tokens → your token, set Repository access to include ` +
          `${repo}, and under Repository permissions set Contents to "Read and write". Then click Save again; the token itself stays the same.`,
      );
    }
  };
  const file = (path) => `/repos/${repo}/contents/${path.split("/").map(encodeURIComponent).join("/")}`;
  const write = writing((path, content, message, sha) =>
    req(file(path), {
      method: "PUT",
      body: JSON.stringify({ message, content, branch, sha }),
    }),
  );

  return {
    // Fine-grained tokens may omit `permissions`; only an explicit false is a refusal.
    verify: () =>
      req(`/repos/${repo}`).then(
        (r) => r.permissions?.push !== false,
        (e) => {
          throw e.status === 404 ? new Error(`Repository "${repo}" not found, or this token can't access it.`) : e;
        },
      ),
    async readJson(path) {
      try {
        const f = await req(`${file(path)}?ref=${encodeURIComponent(branch)}`);
        return { data: JSON.parse(utf8Decode(f.content)), sha: f.sha };
      } catch (e) {
        if (e.status !== 404) throw e;
        throw new Error(
          `${path} was not found on branch "${branch}" of ${repo}. Push or merge the redesign into that branch, or sign in with a different branch.`,
        );
      }
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
    async renameImage(from, to, sha) {
      const blob = await req(`/repos/${repo}/git/blobs/${sha}`);
      const img = await this.uploadImage(to, blob.content.replace(/\s/g, ""));
      await this.deleteImage(from, sha);
      return img;
    },
    deleteImage: writing((path, sha) =>
      req(file(IMG_DIR + path), {
        method: "DELETE",
        body: JSON.stringify({ message: `Delete image ${path}`, sha, branch }),
      }),
    ),
    rawUrl: (path) => `https://raw.githubusercontent.com/${repo}/${branch}/${IMG_DIR}${path}`,
  };
}
