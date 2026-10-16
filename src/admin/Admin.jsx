import { useEffect, useMemo, useRef, useState } from "react";
import "./admin.css";
import { client, fileToBase64 } from "./github";
import { sections, clean, changes } from "./schema";
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
      {import.meta.env.DEV && (
        <button type="button" className="btn" onClick={() => onLogin({ local: true })}>Edit local files (dev only)</button>
      )}
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
  const groups = {}; // folder -> images; files at the top level go under ""
  for (const img of images) (groups[img.path.split("/").slice(0, -1).join("/")] ||= []).push(img);
  return (
    <>
      <label className="btn">
        Upload images
        <input type="file" accept="image/*" multiple hidden onChange={upload} />
      </label>
      {Object.keys(groups).sort().map((dir) => (
        <details className="item img-group" key={dir} open>
          <summary>{dir || "(top level)"} <span className="muted">{groups[dir].length}</span></summary>
          <div className="gallery-admin">
            {groups[dir].map((img) => (
              <figure key={img.path}>
                <img src={ctx.rawUrl(img.path)} alt="" loading="lazy" />
                <figcaption>{img.path.split("/").pop()}{inUse(img.path) ? "" : " (unused)"}</figcaption>
                <button className="btn danger" onClick={() => remove(img)}>Delete</button>
              </figure>
            ))}
          </div>
        </details>
      ))}
    </>
  );
}

function Changes({ diff }) {
  if (!diff.length) return <p className="muted">No unsaved changes.</p>;
  return diff.map((c, i) => (
    <div className="item change" key={i}>
      <strong>{c.section}{c.item && ` › ${c.item}`}</strong> <span className="muted">{c.kind}</span>
      {c.fields.map((f) => (
        <p key={f.key}>
          <span className="lbl">{f.key}</span>
          <del>{f.from}</del> <ins>{f.to}</ins>
        </p>
      ))}
    </div>
  ));
}

export default function Admin() {
  const [auth, setAuth] = useState(saved);
  const [site, setSite] = useState(null);
  const [sha, setSha] = useState("");
  const [base, setBase] = useState(null); // the saved content, for the Changes tab
  const [images, setImages] = useState([]);
  const [tab, setTab] = useState("profile");
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState({ text: "", error: false });
  const loaded = useRef(false);
  const preview = useRef();
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
    sessionStorage.removeItem("admin.preview"); // never start from a stale draft
    run(auth.local ? "Loaded local files." : "Loaded the latest content from GitHub.", async () => {
      const [{ data, sha }, imgs] = await Promise.all([gh.readJson("src/content/site.json"), gh.listImages()]);
      setSite(data);
      setBase(clean(data));
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

  const extOf = (name) => (name.match(/\.\w+$/) || [".png"])[0].toLowerCase();
  // <folder>/<folder>_<n>.<ext>; n is unique per folder whatever the extension
  const nextPath = (folder, ext, taken = images.map((i) => i.path)) => {
    let n = 1;
    while (taken.some((p) => p.startsWith(`${folder}/${folder}_${n}.`))) n++;
    return `${folder}/${folder}_${n}${ext}`;
  };

  const ctx = {
    gh,
    images,
    run,
    rawUrl: gh.rawUrl,
    async upload(file, folder) {
      const ext = extOf(file.name);
      const path = folder ? nextPath(folder, ext) : `uploads/${Date.now()}-${file.name.replace(/[^\w.-]+/g, "_")}`;
      const img = await run(`Uploaded ${path}`, async () => gh.uploadImage(path, await fileToBase64(file)));
      setImages((list) => [...list, img]);
      return path;
    },
    // Copy + delete on GitHub; every use of the old paths in the (unsaved) content is repointed, so Save afterwards.
    async rename(froms, folder) {
      const taken = images.map((i) => i.path);
      const done = new Map();
      try {
        await run(`Renamed ${froms.length} image(s). Save to publish.`, async () => {
          for (const from of froms) {
            const to = nextPath(folder, extOf(from), taken);
            done.set(from, await gh.renameImage(from, to, images.find((i) => i.path === from).sha));
            taken.push(to);
          }
        });
      } finally {
        if (done.size) {
          setImages((list) => list.map((i) => done.get(i.path) || i));
          let json = JSON.stringify(site);
          for (const [from, { path }] of done) json = json.split(`"${from}"`).join(`"${path}"`);
          setSite(JSON.parse(json));
          setDirty(true);
        }
      }
    },
  };

  const save = () =>
    run("Saved. The site rebuilds in about a minute.", async () => {
      const next = clean(site);
      setSha(await gh.saveJson("src/content/site.json", next, sha, "Update site content via admin"));
      setSite(next);
      setBase(next);
      setDirty(false);
      sessionStorage.removeItem("admin.preview");
    }).catch(() => {});

  const change = (key) => (value) => {
    setSite({ ...site, [key]: value });
    setDirty(true);
  };
  const diff = site && base ? changes(base, clean(site)) : [];
  const section = sections.find((s) => s.key === tab);

  return (
    <div className={auth.local ? "split" : undefined}>
    <div className="admin">
      <header className="bar">
        <strong>Admin</strong>
        <a href="#top">View site</a>
        <button className="btn" onClick={() => { sessionStorage.removeItem(KEY); localStorage.removeItem(KEY); setAuth(null); setSite(null); loaded.current = false; }}>Sign out</button>
        {auth.local && (
          <button
            className="btn"
            disabled={!site}
            onClick={() => {
              sessionStorage.setItem("admin.preview", JSON.stringify(clean(site)));
              preview.current?.contentWindow.location.reload();
            }}
          >
            Preview
          </button>
        )}
        <button className="btn" disabled={!dirty} onClick={() => confirm("Throw away all unsaved edits?") && (setSite(base), setDirty(false))}>Discard</button>
        <button className="btn primary" disabled={!dirty} onClick={save}>{dirty ? "● Save changes" : "Saved"}</button>
      </header>
      <p className={status.error ? "err" : "muted"} role="status">{status.text}</p>
      {site && (
        <>
          <div className="tabs" role="tablist">
            {[...sections, { key: "images", label: "Images" }, ...(diff.length ? [{ key: "changes", label: `Changes (${diff.length})` }] : [])].map((s) => (
              <button key={s.key} role="tab" aria-selected={tab === s.key} onClick={() => setTab(s.key)}>{s.label}</button>
            ))}
          </div>
          {tab === "changes" ? (
            <Changes diff={diff} />
          ) : tab === "images" ? (
            <Images images={images} ctx={ctx} site={site} onDeleted={(p) => setImages((l) => l.filter((i) => i.path !== p))} />
          ) : section.list ? (
            <ItemList fields={section.fields} titleKey={section.titleKey} items={site[tab]} onChange={change(tab)} ctx={ctx} />
          ) : (
            <Form fields={section.fields} value={site[tab]} onChange={change(tab)} ctx={ctx} />
          )}
        </>
      )}
    </div>
    {auth.local && <iframe ref={preview} className="preview" src="/" title="Live preview" />}
    </div>
  );
}
