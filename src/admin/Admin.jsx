import { useEffect, useMemo, useRef, useState } from "react";
import "./admin.css";
import { client, fileToBase64 } from "./github";
import { sections, clean } from "./schema";
import { Form, ItemList } from "./Fields";

const KEY = "admin.auth";
const saved = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
};

function Login({ onLogin }) {
  const init = saved() || { repo: "Jason-Wuuuu/Jason", branch: "main", token: "" };
  const [a, setA] = useState(init);
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    try {
      const gh = client(a);
      if (!(await gh.verify())) throw new Error("This token can't push to the repo.");
      await gh.readJson("src/content/site.json"); // fail here, with a clear message, rather than after sign-in
      const store = remember ? localStorage : sessionStorage;
      store.setItem(KEY, JSON.stringify(a));
      onLogin(a);
    } catch (e) {
      setErr(e.message);
    }
  };
  const set = (k) => (e) => setA({ ...a, [k]: e.target.value });
  return (
    <form className="login" onSubmit={submit}>
      <h1>Admin</h1>
      <p className="muted">
        Edits are committed straight to your repo; the Pages workflow then rebuilds the site. Use a fine-grained
        token limited to this repo with Contents: read and write.
      </p>
      <label><span className="lbl">Repository</span><input value={a.repo} onChange={set("repo")} /></label>
      <label><span className="lbl">Branch</span><input value={a.branch} onChange={set("branch")} /></label>
      <label><span className="lbl">Token</span><input type="password" value={a.token} onChange={set("token")} autoComplete="off" /></label>
      <label className="check"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember on this device</label>
      {err && <p className="err" role="alert">{err}</p>}
      <button className="btn primary" disabled={!a.token}>Sign in</button>
    </form>
  );
}

function Images({ images, ctx, site, onDeleted }) {
  const inUse = (path) => JSON.stringify(site).includes(`"${path}"`);
  const remove = async (img) => {
    const warn = inUse(img.path) ? `\n\n"${img.path}" is still used in your unsaved or saved content.` : "";
    if (!confirm(`Delete ${img.path} from the repo?${warn}`)) return;
    await ctx.run(`Deleted ${img.path}`, () => ctx.gh.deleteImage(img.path, img.sha));
    onDeleted(img.path);
  };
  const upload = async (e) => {
    for (const f of e.target.files) await ctx.upload(f);
    e.target.value = "";
  };
  return (
    <>
      <label className="btn">
        Upload images
        <input type="file" accept="image/*" multiple hidden onChange={upload} />
      </label>
      <div className="gallery-admin">
        {images.map((img) => (
          <figure key={img.path}>
            <img src={ctx.rawUrl(img.path)} alt="" loading="lazy" />
            <figcaption>{img.path}{inUse(img.path) ? "" : " (unused)"}</figcaption>
            <button className="btn danger" onClick={() => remove(img)}>Delete</button>
          </figure>
        ))}
      </div>
    </>
  );
}

export default function Admin() {
  const [auth, setAuth] = useState(saved);
  const [site, setSite] = useState(null);
  const [sha, setSha] = useState("");
  const [images, setImages] = useState([]);
  const [tab, setTab] = useState("profile");
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState({ text: "", error: false });
  const loaded = useRef(false);
  const gh = useMemo(() => auth && client(auth), [auth]);

  const run = async (okText, fn) => {
    setStatus({ text: "Working…", error: false });
    try {
      const r = await fn();
      setStatus({ text: okText, error: false });
      return r;
    } catch (e) {
      setStatus({ text: e.message, error: true });
      throw e;
    }
  };

  useEffect(() => {
    if (!gh || loaded.current) return;
    loaded.current = true;
    run("Loaded the latest content from GitHub.", async () => {
      const [{ data, sha }, imgs] = await Promise.all([gh.readJson("src/content/site.json"), gh.listImages()]);
      setSite(data);
      setSha(sha);
      setImages(imgs);
    }).catch(() => {});
  }, [gh]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => e.preventDefault();
    addEventListener("beforeunload", warn);
    return () => removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (!auth) return <Login onLogin={setAuth} />;

  const ctx = {
    gh,
    images,
    run,
    rawUrl: gh.rawUrl,
    async upload(file) {
      const path = `uploads/${Date.now()}-${file.name.replace(/[^\w.-]+/g, "_")}`;
      const img = await run(`Uploaded ${path}`, async () => gh.uploadImage(path, await fileToBase64(file)));
      setImages((list) => [...list, img]);
      return path;
    },
  };

  const save = () =>
    run("Saved. The site rebuilds in about a minute.", async () => {
      const next = clean(site);
      setSha(await gh.saveJson("src/content/site.json", next, sha, "Update site content via admin"));
      setSite(next);
      setDirty(false);
    }).catch(() => {});

  const change = (key) => (value) => {
    setSite({ ...site, [key]: value });
    setDirty(true);
  };
  const section = sections.find((s) => s.key === tab);

  return (
    <div className="admin">
      <header className="bar">
        <strong>Admin</strong>
        <a href="#top">View site</a>
        <button className="btn" onClick={() => { sessionStorage.removeItem(KEY); localStorage.removeItem(KEY); setAuth(null); setSite(null); loaded.current = false; }}>Sign out</button>
        <button className="btn primary" disabled={!dirty} onClick={save}>{dirty ? "Save changes" : "Saved"}</button>
      </header>
      <p className={status.error ? "err" : "muted"} role="status">{status.text}</p>
      {site && (
        <>
          <div className="tabs" role="tablist">
            {[...sections, { key: "images", label: "Images" }].map((s) => (
              <button key={s.key} role="tab" aria-selected={tab === s.key} onClick={() => setTab(s.key)}>{s.label}</button>
            ))}
          </div>
          {tab === "images" ? (
            <Images images={images} ctx={ctx} site={site} onDeleted={(p) => setImages((l) => l.filter((i) => i.path !== p))} />
          ) : section.list ? (
            <ItemList fields={section.fields} titleKey={section.titleKey} items={site[tab]} onChange={change(tab)} ctx={ctx} />
          ) : (
            <Form fields={section.fields} value={site[tab]} onChange={change(tab)} ctx={ctx} />
          )}
        </>
      )}
    </div>
  );
}
