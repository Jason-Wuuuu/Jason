import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "node:fs";
import path from "node:path";

// Dev only: lets /admin read and write site.json and public/images on disk instead of GitHub.
const localAdmin = () => ({
  name: "local-admin",
  apply: "serve",
  configureServer(server) {
    const root = server.config.root;
    const site = path.join(root, "src/content/site.json");
    const imgs = path.join(root, "public/images");
    const walk = (d) =>
      fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(path.join(d, e.name)) : /\.(png|jpe?g|gif|webp|svg)$/i.test(e.name) ? [path.join(d, e.name)] : [],
      );
    server.middlewares.use("/__local", (req, res) => {
      const body = [];
      req.on("data", (c) => body.push(c));
      req.on("end", () => {
        const send = (code, data) => (res.statusCode = code, res.setHeader("content-type", "application/json"), res.end(JSON.stringify(data ?? {})));
        try {
          const url = decodeURIComponent(req.url.split("?")[0]);
          const text = Buffer.concat(body).toString();
          if (url === "/site") {
            if (req.method === "PUT") fs.writeFileSync(site, text);
            return send(200, req.method === "PUT" ? {} : { text: fs.readFileSync(site, "utf8") });
          }
          if (url === "/images" && req.method === "GET")
            return send(200, walk(imgs).map((f) => ({ path: path.relative(imgs, f).split(path.sep).join("/"), sha: "" })));
          if (url === "/rename" && req.method === "POST") {
            const { from, to } = JSON.parse(text);
            const [a, b] = [from, to].map((x) => path.resolve(imgs, x));
            if (![a, b].every((f) => f.startsWith(imgs + path.sep)) || fs.existsSync(b)) return send(400, { message: "bad path" });
            fs.mkdirSync(path.dirname(b), { recursive: true });
            fs.renameSync(a, b);
            return send(200);
          }
          const file = path.resolve(imgs, "." + url.replace(/^\/images/, ""));
          if (!url.startsWith("/images/") || !file.startsWith(imgs + path.sep)) return send(400, { message: "bad path" });
          if (req.method === "PUT") (fs.mkdirSync(path.dirname(file), { recursive: true }), fs.writeFileSync(file, Buffer.from(text, "base64")));
          else if (req.method === "DELETE") fs.rmSync(file);
          else return send(405);
          send(200);
        } catch (e) {
          send(500, { message: e.message });
        }
      });
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react(), localAdmin()],
    base: "/",
  };

  if (command !== "serve") {
    config.base = "/Jason/";
  }

  return config;
});
