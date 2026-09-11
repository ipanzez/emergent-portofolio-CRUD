import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { api, assetUrl, formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Field, PageHeader, Panel } from "@/components/admin/Shared";
import { ImageUpload, uploadImage } from "@/components/admin/ImageUpload";

const EMPTY = {
  title: "", slug: "", category: "", year: "", cover_url: "", overview: "", problem: "", goal: "", process: [], kpis: [], role: "", tools: [],
  color_palette: ["#FFDADC", "#E62129", "#731014"], typography: [{ name: "Roboto", usage: "" }], gallery: [], link: "", outcome: "", featured: false, order: 0,
};

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(id ? null : EMPTY);
  const [saving, setSaving] = useState(false);
  const [toolsText, setToolsText] = useState("");

  useEffect(() => {
    if (!id) return;
    api.get(`/admin/projects/${id}`).then((r) => { setForm(r.data); setToolsText(r.data.tools.join(", ")); }).catch(() => navigate("/admin/projects"));
  }, [id, navigate]);

  if (!form) return null;
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e?.target ? e.target.value : e }));
  const setList = (key, index, value) => setForm((f) => ({ ...f, [key]: f[key].map((v, i) => (i === index ? value : v)) }));
  const removeAt = (key, index) => setForm((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== index) }));
  const push = (key, value) => setForm((f) => ({ ...f, [key]: [...f[key], value] }));

  const addGallery = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      try { push("gallery", await uploadImage(file)); } catch (err) { toast.error(formatApiError(err)); }
    }
    e.target.value = "";
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      tools: toolsText.split(",").map((t) => t.trim()).filter(Boolean),
      typography: form.typography.filter((t) => t.name.trim()),
      process: form.process.filter((s) => s.title.trim()),
      kpis: form.kpis.filter((k) => k.value.trim() && k.label.trim()),
    };
    try {
      if (id) await api.put(`/admin/projects/${id}`, payload);
      else await api.post("/admin/projects", payload);
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      qc.invalidateQueries({ queryKey: ["portfolio"] });
      qc.invalidateQueries({ queryKey: ["project"] });
      toast.success("Project saved");
      navigate("/admin/projects");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} data-testid="project-form">
      <button type="button" onClick={() => navigate("/admin/projects")} className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"><ArrowLeft size={14} /> Projects</button>
      <PageHeader title={id ? "Edit project" : "New project"}>
        <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-2 shadow-soft">
          <Label htmlFor="project-featured" className="text-sm">Featured</Label>
          <Switch id="project-featured" data-testid="project-featured-switch" checked={form.featured} onCheckedChange={set("featured")} />
        </div>
        <Button data-testid="project-save-btn" type="submit" disabled={saving} className="h-10 rounded-xl bg-ink px-6 text-white hover:bg-gray-800">{saving ? "Saving…" : "Save project"}</Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Basics">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="project-title" label="Title" value={form.title} onChange={set("title")} required />
              <Field id="project-category" label="Category" placeholder="E-Commerce" value={form.category} onChange={set("category")} />
              <Field id="project-slug" label="Slug" hint="Kosongkan untuk otomatis dari judul" value={form.slug} onChange={set("slug")} />
              <Field id="project-year" label="Year" value={form.year} onChange={set("year")} />
              <Field id="project-overview" label="Overview" textarea className="sm:col-span-2" value={form.overview} onChange={set("overview")} />
              <Field id="project-role" label="Role" value={form.role} onChange={set("role")} />
              <Field id="project-tools" label="Tools" hint="Pisahkan dengan koma" value={toolsText} onChange={(e) => setToolsText(e.target.value)} />
              <Field id="project-link" label="External link" type="url" placeholder="https://" value={form.link} onChange={set("link")} />
              <Field id="project-outcome" label="Outcome" textarea className="sm:col-span-2" value={form.outcome} onChange={set("outcome")} />
            </div>
          </Panel>

          <Panel title="Case study">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="project-problem" label="Problem" textarea placeholder="Masalah apa yang dihadapi pengguna/bisnis?" value={form.problem} onChange={set("problem")} />
              <Field id="project-goal" label="Goal" textarea placeholder="Target yang ingin dicapai" value={form.goal} onChange={set("goal")} />
            </div>
            <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-wider text-gray-500">Process</p>
            <div className="space-y-3" data-testid="process-editor">
              {form.process.map((s, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
                  <input data-testid={`process-title-${i}`} placeholder={`Step ${i + 1} (Research, Define…)`} value={s.title} onChange={(e) => setList("process", i, { ...s, title: e.target.value })} className="h-10 rounded-xl border border-gray-200 px-3 text-sm" />
                  <input data-testid={`process-desc-${i}`} placeholder="Apa yang dilakukan" value={s.description} onChange={(e) => setList("process", i, { ...s, description: e.target.value })} className="h-10 rounded-xl border border-gray-200 px-3 text-sm" />
                  <button type="button" onClick={() => removeAt("process", i)} className="grid h-10 w-10 place-items-center rounded-xl text-gray-400 hover:bg-rose-soft hover:text-rose"><X size={14} /></button>
                </div>
              ))}
              <Button type="button" variant="outline" data-testid="process-add-btn" onClick={() => push("process", { title: "", description: "" })} className="rounded-xl"><Plus size={14} className="mr-1" /> Add step</Button>
            </div>
            <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-wider text-gray-500">KPI / Impact</p>
            <div className="space-y-3" data-testid="kpi-editor">
              {form.kpis.map((k, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
                  <input data-testid={`kpi-value-${i}`} placeholder="+31%" value={k.value} onChange={(e) => setList("kpis", i, { ...k, value: e.target.value })} className="h-10 rounded-xl border border-gray-200 px-3 font-mono text-sm" />
                  <input data-testid={`kpi-label-${i}`} placeholder="Checkout completion" value={k.label} onChange={(e) => setList("kpis", i, { ...k, label: e.target.value })} className="h-10 rounded-xl border border-gray-200 px-3 text-sm" />
                  <button type="button" onClick={() => removeAt("kpis", i)} className="grid h-10 w-10 place-items-center rounded-xl text-gray-400 hover:bg-rose-soft hover:text-rose"><X size={14} /></button>
                </div>
              ))}
              <Button type="button" variant="outline" data-testid="kpi-add-btn" onClick={() => push("kpis", { value: "", label: "" })} className="rounded-xl"><Plus size={14} className="mr-1" /> Add KPI</Button>
            </div>
          </Panel>

          <Panel title="Color palette">
            <div className="flex flex-wrap gap-3" data-testid="palette-editor">
              {form.color_palette.map((hex, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2">
                  <input type="color" value={/^#[0-9a-f]{6}$/i.test(hex) ? hex : "#000000"} onChange={(e) => setList("color_palette", i, e.target.value.toUpperCase())} className="h-8 w-8 cursor-pointer rounded-md border-0 bg-transparent" />
                  <input data-testid={`palette-hex-${i}`} value={hex} onChange={(e) => setList("color_palette", i, e.target.value)} className="w-24 font-mono text-sm uppercase outline-none" />
                  <button type="button" onClick={() => removeAt("color_palette", i)} className="text-gray-400 hover:text-rose"><X size={14} /></button>
                </div>
              ))}
              <Button type="button" variant="outline" data-testid="palette-add-btn" onClick={() => push("color_palette", "#2563EB")} className="h-12 rounded-xl"><Plus size={14} className="mr-1" /> Add color</Button>
            </div>
          </Panel>

          <Panel title="Typography">
            <div className="space-y-3">
              {form.typography.map((t, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <input data-testid={`typography-name-${i}`} placeholder="Font name" value={t.name} onChange={(e) => setList("typography", i, { ...t, name: e.target.value })} className="h-10 rounded-xl border border-gray-200 px-3 text-sm" />
                  <input placeholder="Usage (Heading, Body…)" value={t.usage} onChange={(e) => setList("typography", i, { ...t, usage: e.target.value })} className="h-10 rounded-xl border border-gray-200 px-3 text-sm" />
                  <button type="button" onClick={() => removeAt("typography", i)} className="grid h-10 w-10 place-items-center rounded-xl text-gray-400 hover:bg-rose-soft hover:text-rose"><X size={14} /></button>
                </div>
              ))}
              <Button type="button" variant="outline" data-testid="typography-add-btn" onClick={() => push("typography", { name: "", usage: "" })} className="rounded-xl"><Plus size={14} className="mr-1" /> Add font</Button>
            </div>
          </Panel>

          <Panel title="Gallery">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" data-testid="gallery-editor">
              {form.gallery.map((g, i) => (
                <div key={g + i} className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
                  <img src={assetUrl(g)} alt="" className="h-full w-full object-cover" />
                  <button type="button" data-testid={`gallery-remove-${i}`} onClick={() => removeAt("gallery", i)} className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-gray-700 shadow"><X size={12} /></button>
                </div>
              ))}
              <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-500 hover:text-gray-800">
                <Plus size={16} /> Add images
                <input data-testid="gallery-input" type="file" accept="image/*" multiple className="hidden" onChange={addGallery} />
              </label>
            </div>
          </Panel>
        </div>

        <Panel title="Cover image" className="h-fit">
          <ImageUpload value={form.cover_url} onChange={set("cover_url")} aspect="aspect-[4/3]" label="Upload cover" testId="cover-upload" />
        </Panel>
      </div>
    </form>
  );
}
