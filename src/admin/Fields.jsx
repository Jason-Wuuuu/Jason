import { blank } from "./schema";

const move = (arr, i, d) => {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

export function ImagePicker({ value, onChange, ctx, folder }) {
  const upload = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (file) onChange(await ctx.upload(file, folder));
  };
  return (
    <div className="picker">
      {value && <img src={ctx.rawUrl(value)} alt="" />}
      <select value={value || ""} onChange={(e) => onChange(e.target.value)}>
        <option value="">(none)</option>
        {value && !ctx.images.some((i) => i.path === value) && <option value={value}>{value}</option>}
        {ctx.images.map((i) => (
          <option key={i.path} value={i.path}>{i.path}</option>
        ))}
      </select>
      <label className="btn">
        Upload new
        <input type="file" accept="image/*" hidden onChange={upload} />
      </label>
    </div>
  );
}

// "Aug 2024 – now" <-> two month pickers; "May – Oct 2024" (shared year) still parses.
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const toMonth = (m, y) => (MON.includes(m) && y ? `${y}-${String(MON.indexOf(m) + 1).padStart(2, "0")}` : "");
const fromMonth = (v) => (v ? `${MON[+v.slice(5) - 1]} ${v.slice(0, 4)}` : "");
function DateRange({ value = "", onChange }) {
  const [a = "", b = ""] = value.split(/\s*[–-]\s*/);
  const [am, ay] = a.split(" ");
  const now = /^(now|present)$/i.test(b);
  const [bm, by] = b.split(" ");
  const start = toMonth(am, ay || by), end = now ? "" : toMonth(bm, by);
  const set = (s, e, n) => onChange(`${fromMonth(s)} – ${n ? "now" : fromMonth(e)}`);
  return (
    <div className="daterange">
      <input type="month" value={start} onChange={(e) => set(e.target.value, end, now)} />
      <span>–</span>
      <input type="month" value={end} disabled={now} onChange={(e) => set(start, e.target.value, false)} />
      <label className="check"><input type="checkbox" checked={now} onChange={(e) => set(start, end, e.target.checked)} /> Present</label>
    </div>
  );
}

export function Field({ f, value, onChange, ctx, folder: dir }) {
  const folder = f.folder ?? dir;
  const label = <span className="lbl">{f.label}</span>;
  switch (f.type) {
    case "area":
      return <label>{label}<textarea rows={4} value={value ?? ""} onChange={(e) => onChange(e.target.value)} /></label>;
    case "daterange":
      return <div>{label}<DateRange value={value} onChange={onChange} /></div>;
    case "bool":
      return <label className="check"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> {f.label}</label>;
    case "number":
      return <label>{label}<input type="number" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} /></label>;
    case "select":
      return (
        <label>{label}
          <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
            {f.options.map((o) => {
              const [v, l] = Array.isArray(o) ? o : [o, o];
              return <option key={v} value={v}>{l}</option>;
            })}
          </select>
        </label>
      );
    case "lines": {
      const sep = f.sep || "\n";
      return (
        <label>{label}
          <textarea rows={sep === "\n" ? 5 : 8} value={(value || []).join(sep)} onChange={(e) => onChange(e.target.value.split(sep))} />
        </label>
      );
    }
    case "image":
      return <div>{label}<ImagePicker value={value} onChange={onChange} ctx={ctx} folder={folder} /></div>;
    case "images": {
      // existing repo images not yet named <folder>/<folder>_N
      const todo = folder ? [...new Set((value || []).filter((v) => ctx.images.some((i) => i.path === v) && !v.startsWith(`${folder}/${folder}_`)))] : [];
      return (
        <div>{label}
          {(value || []).map((v, i) => (
            <div className="row-edit" key={i}>
              <ImagePicker value={v} onChange={(x) => onChange(value.map((y, k) => (k === i ? x : y)))} ctx={ctx} folder={folder} />
              <Controls
                onUp={() => onChange(move(value, i, -1))}
                onDown={() => onChange(move(value, i, 1))}
                onDelete={() => onChange(value.filter((_, k) => k !== i))}
              />
            </div>
          ))}
          <button className="btn" onClick={() => onChange([...(value || []), ""])}>+ Add image</button>
          {todo.length > 0 && (
            <button className="btn" onClick={() => ctx.rename(todo, folder)}>Rename all to {folder}_N ({todo.length})</button>
          )}
        </div>
      );
    }
    case "list":
      return <div>{label}<ItemList fields={f.fields} titleKey={f.titleKey} items={value || []} onChange={onChange} ctx={ctx} /></div>;
    default:
      return <label>{label}<input value={value ?? ""} onChange={(e) => onChange(e.target.value)} /></label>;
  }
}

function Controls({ onUp, onDown, onDelete }) {
  return (
    <span className="controls">
      <button className="btn" onClick={onUp} aria-label="Move up">↑</button>
      <button className="btn" onClick={onDown} aria-label="Move down">↓</button>
      <button className="btn danger" onClick={onDelete} aria-label="Delete">Delete</button>
    </span>
  );
}

// Uploads from a project go to images/<title_slug>/, matching the existing folders (memory_maker, stock_price_lstm, ...).
const slug = (t = "") => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

export function Form({ fields, value, onChange, ctx }) {
  const folder = slug(value.title);
  return fields.map((f) => (
    <Field key={f.key} f={f} value={value[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} ctx={ctx} folder={folder} />
  ));
}

export function ItemList({ fields, titleKey, items, onChange, ctx }) {
  const set = (i, item) => onChange(items.map((x, k) => (k === i ? item : x)));
  const flag = fields.find((f) => f.key === "featured"); // shown in the collapsed row, not the form
  const rest = flag ? fields.filter((f) => f !== flag) : fields;
  return (
    <div className="items">
      {items.map((item, i) => (
        <details key={i} className={item.archived ? "item archived" : "item"}>
          <summary>
            {item[titleKey] || "(untitled)"}{item.archived && " (hidden)"}
            <span className="flags">
              {flag && (
                <label className="flag">
                  <input type="checkbox" checked={!!item.featured} onChange={(e) => set(i, { ...item, featured: e.target.checked })} /> Featured
                </label>
              )}
              <label className="flag">
                <input type="checkbox" checked={!!item.archived} onChange={(e) => set(i, { ...item, archived: e.target.checked || undefined })} /> Archived
              </label>
            </span>
          </summary>
          <Form fields={rest} value={item} onChange={(v) => set(i, v)} ctx={ctx} />
          <Controls
            onUp={() => onChange(move(items, i, -1))}
            onDown={() => onChange(move(items, i, 1))}
            onDelete={() => confirm(`Delete "${item[titleKey] || "this item"}"?`) && onChange(items.filter((_, k) => k !== i))}
          />
        </details>
      ))}
      <button className="btn" onClick={() => onChange([blank(fields), ...items])}>+ Add new at top</button>
    </div>
  );
}
