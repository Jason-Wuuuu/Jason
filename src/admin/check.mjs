// Run: node src/admin/check.mjs — checks the pure helpers behind Save, the avatar style table, and admin error messages.
import assert from "node:assert";
import { clean, blank } from "./schema.js";

assert.deepStrictEqual(clean({ points: ["a", "  ", "", " b "], n: 3, list: [{ s: ["x", ""] }] }), {
  points: ["a", "b"], n: 3, list: [{ s: ["x"] }],
});
assert.deepStrictEqual(blank([{ key: "t", type: "text" }, { key: "p", type: "lines" }, { key: "n", type: "number" }, { key: "b", type: "bool" }]), { t: "", p: [], n: 0, b: false });

const b64 = (s) => Buffer.from(s, "utf8").toString("base64");
assert.strictEqual(new TextDecoder().decode(Uint8Array.from(atob(b64("Aug 2024 – now 🏂")), (c) => c.charCodeAt(0))), "Aug 2024 – now 🏂");

// avatar styles: crops stay inside the image, and every style has desktop / tablet / phone widths
const { AVATAR_STYLES, DEFAULT_STYLE } = await import("../avatar.js");
assert(DEFAULT_STYLE in AVATAR_STYLES);
for (const [name, { n, crop: [x, y, size], width }] of Object.entries(AVATAR_STYLES)) {
  assert(n > 0 && size > 0 && x >= 0 && y >= 0 && x + size <= 1 && y + size <= 1, `${name}: crop`);
  assert.strictEqual(width.length, 3, `${name}: widths`);
}

// a missing content file on the branch gives an actionable message (the "404 after login" case)
const { client } = await import("./github.js");
globalThis.fetch = async () => ({ ok: false, status: 404, statusText: "Not Found", json: async () => ({ message: "Not Found" }) });
await assert.rejects(client({ repo: "a/b", branch: "main", token: "t" }).readJson("src/content/site.json"), /not found on branch "main" of a\/b/);
await assert.rejects(client({ repo: "a/b", branch: "main", token: "t" }).verify(), /Repository "a\/b" not found/);
console.log("ok");
