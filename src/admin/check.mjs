// Run: node src/admin/check.mjs — checks the pure helpers behind Save, the avatar style table, and admin error messages.
import assert from "node:assert";
import { clean, blank, changes } from "./schema.js";

assert.deepStrictEqual(clean({ points: ["a", "  ", "", " b "], n: 3, list: [{ s: ["x", ""] }] }), {
  points: ["a", "b"], n: 3, list: [{ s: ["x"] }],
});
assert.deepStrictEqual(blank([{ key: "t", type: "text" }, { key: "p", type: "lines" }, { key: "n", type: "number" }, { key: "b", type: "bool" }]), { t: "", p: [], n: 0, b: false });

// changes(): edits are matched by content/title, so an insert or a move doesn't flag the other items
const exp = (o) => ({ role: o, company: "c", place: "p", date: "d", points: [] });
const was = { experience: [exp("A"), exp("B")], projects: [], education: [], profile: { name: "x" }, about: {} };
assert.deepStrictEqual(changes(was, was), []);
assert.deepStrictEqual(changes(was, { ...was, experience: [exp("N"), exp("A"), exp("B")] }).map((c) => [c.kind, c.item]), [["added", "N"]]);
assert.deepStrictEqual(changes(was, { ...was, experience: [{ ...exp("A"), date: "e" }, exp("B")] })[0].fields, [{ key: "date", from: "d", to: "e" }]);
assert.deepStrictEqual(changes(was, { ...was, experience: [exp("B"), exp("A")] }).map((c) => c.kind), ["reordered"]);
assert.deepStrictEqual(changes(was, { ...was, experience: [exp("A")] }).map((c) => [c.kind, c.item]), [["removed", "B"]]);

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
// a token that can read but not write (the "403: Resource not accessible by personal access token" case)
globalThis.fetch = async () => ({ ok: false, status: 403, statusText: "Forbidden", json: async () => ({ message: "Resource not accessible by personal access token" }) });
const gh = client({ repo: "a/b", branch: "main", token: "t" });
await assert.rejects(gh.saveJson("src/content/site.json", {}, "sha", "msg"), /Contents to "Read and write"/);
await assert.rejects(gh.deleteImage("x.png", "sha"), /Contents to "Read and write"/);
console.log("ok");
