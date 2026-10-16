// Run: node src/admin/check.mjs — checks the pure helpers behind Save.
import assert from "node:assert";
import { clean, blank } from "./schema.js";

assert.deepStrictEqual(clean({ points: ["a", "  ", "", " b "], n: 3, list: [{ s: ["x", ""] }] }), {
  points: ["a", "b"], n: 3, list: [{ s: ["x"] }],
});
assert.deepStrictEqual(blank([{ key: "t", type: "text" }, { key: "p", type: "lines" }, { key: "n", type: "number" }]), { t: "", p: [], n: 0 });

const b64 = (s) => Buffer.from(s, "utf8").toString("base64");
assert.strictEqual(new TextDecoder().decode(Uint8Array.from(atob(b64("Aug 2024 – now 🏂")), (c) => c.charCodeAt(0))), "Aug 2024 – now 🏂");
console.log("ok");
