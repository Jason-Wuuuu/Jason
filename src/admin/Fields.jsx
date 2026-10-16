import { blank } from "./schema";

const move = (arr, i, d) => {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

export function ImagePicker({ value, onChange, ctx }) {
  const upload = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (file) onChange(await ctx.upload(file));
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

export function Field({ f, value, onChange, ctx }) {
  const label = <span className="lbl">{f.label}</span>;
  switch (f.type) {
    case "area":
      return <label>{label}<textarea rows={4} value={value ?? ""} onChange={(e) => onChange(e.target.value)} /></label>;
    case "bool":
      return <label className="check"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> {f.label}</label>;
    case "number":
      return <label>{label}<input type="number" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} /></label>;
    case "select":
      return (
        <label>{label}
          <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
            {f.options.map((o) => <option key={o}>{o}</option>)}
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
      return <div>{label}<ImagePicker value={value} onChange={onChange} ctx={ctx} /></div>;
    case "images":
      return (
        <div>{label}
          {(value || []).map((v, i) => (
            <div className="row-edit" key={i}>
              <ImagePicker value={v} onChange={(x) => onChange(value.map((y, k) => (k === i ? x : y)))} ctx={ctx} />
              <Controls
                onUp={() => onChange(move(value, i, -1))}
                onDown={() => onChange(move(value, i, 1))}
                onDelete={() => onChange(value.filter((_, k) => k !== i))}
              />
            </div>
          ))}
          <button className="btn" onClick={() => onChange([...(value || []), ""])}>+ Add screenshot</button>
        </div>
      );
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

export function Form({ fields, value, onChange, ctx }) {
  return fields.map((f) => (
    <Field key={f.key} f={f} value={value[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} ctx={ctx} />
  ));
}

export function ItemList({ fields, titleKey, items, onChange, ctx }) {
  const set = (i, item) => onChange(items.map((x, k) => (k === i ? item : x)));
  return (
    <div className="items">
      {items.map((item, i) => (
        <details key={i} className="item">
          <summary>{item[titleKey] || "(untitled)"}</summary>
          <Form fields={fields} value={item} onChange={(v) => set(i, v)} ctx={ctx} />
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
