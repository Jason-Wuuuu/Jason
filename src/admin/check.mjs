// Run: node src/admin/check.mjs — checks the pure helpers behind Save, and the avatar sprite's shape.
import assert from "node:assert";
import fs from "node:fs";
import { clean, blank } from "./schema.js";

assert.deepStrictEqual(clean({ points: ["a", "  ", "", " b "], n: 3, list: [{ s: ["x", ""] }] }), {
  points: ["a", "b"], n: 3, list: [{ s: ["x"] }],
});
assert.deepStrictEqual(blank([{ key: "t", type: "text" }, { key: "p", type: "lines" }, { key: "n", type: "number" }, { key: "b", type: "bool" }]), { t: "", p: [], n: 0, b: false });

const b64 = (s) => Buffer.from(s, "utf8").toString("base64");
assert.strictEqual(new TextDecoder().decode(Uint8Array.from(atob(b64("Aug 2024 – now 🏂")), (c) => c.charCodeAt(0))), "Aug 2024 – now 🏂");

// every sprite row is exactly 24 wide and uses only known colours
const src = fs.readFileSync(new URL("../avatar.js", import.meta.url), "utf8");
const rows = [...src.matchAll(/^\s+"([.A-Za-z]{24})",$/gm)].map((m) => m[1]);
assert.strictEqual(rows.length, 24);
const keys = new Set([...src.matchAll(/^\s+(\S+): "#[0-9a-f]{6}",/gm)].map((m) => m[1].replace(/"/g, "")));
for (const r of rows) for (const ch of r) assert(keys.has(ch), `unknown colour ${ch}`);
console.log("ok");
