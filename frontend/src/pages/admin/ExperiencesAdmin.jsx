import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { useAdminList } from "@/hooks/usePortfolio";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, PageHeader } from "@/components/admin/Shared";

const EMPTY = { position: "", company: "", start: "", end: "Present", description: "", order: 0 };

export default function ExperiencesAdmin() {
  const qc = useQueryClient();
  const { data: items = [] } = useAdminList("experiences");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin", "experiences"] });
    qc.invalidateQueries({ queryKey: ["portfolio"] });
  };
  const set = (key) => (e) => setEditing((f) => ({ ...f, [key]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing.id) await api.put(`/admin/experiences/${editing.id}`, editing);
      else await api.post("/admin/experiences", { ...editing, order: items.length });
      toast.success("Saved");
      setEditing(null);
      refresh();
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };
  const remove = async (id) => {
    if (!window.confirm("Hapus pengalaman ini?")) return;
    try { await api.delete(`/admin/experiences/${id}`); refresh(); } catch (err) { toast.error(formatApiError(err)); }
  };

  return (
    <div data-testid="experiences-page">
      <PageHeader title="Experience" description="Timeline posisi, perusahaan, dan periode.">
        <Button data-testid="experience-add-btn" onClick={() => setEditing(EMPTY)} className="h-10 rounded-xl bg-ink px-5 text-white hover:bg-gray-800"><Plus size={16} className="mr-1" /> Add</Button>
      </PageHeader>
      <ul className="space-y-3">
        {items.map((exp, i) => (
          <li key={exp.id} data-testid={`experience-row-${i}`} className="card-soft flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="font-bold text-gray-900">{exp.position}</p>
              <p className="text-sm text-gray-500">{exp.company} · {exp.start} — {exp.end}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" data-testid={`experience-edit-${i}`} onClick={() => setEditing(exp)} className="rounded-lg"><Pencil size={14} /></Button>
              <Button variant="outline" size="sm" data-testid={`experience-delete-${i}`} onClick={() => remove(exp.id)} className="rounded-lg text-rose hover:bg-rose-soft"><Trash2 size={14} /></Button>
            </div>
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-gray-400">Belum ada pengalaman.</li>}
      </ul>

      <Dialog open={Boolean(editing)} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="rounded-3xl sm:max-w-lg" data-testid="experience-dialog">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit experience" : "New experience"}</DialogTitle></DialogHeader>
          {editing && (
            <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
              <Field id="exp-position" label="Position" value={editing.position} onChange={set("position")} required />
              <Field id="exp-company" label="Company" value={editing.company} onChange={set("company")} required />
              <Field id="exp-start" label="Start" placeholder="2023" value={editing.start} onChange={set("start")} required />
              <Field id="exp-end" label="End" placeholder="Present" value={editing.end} onChange={set("end")} required />
              <Field id="exp-description" label="Description" textarea className="sm:col-span-2" value={editing.description} onChange={set("description")} />
              <Button data-testid="experience-save-btn" type="submit" disabled={saving} className="h-11 rounded-xl bg-ink text-white hover:bg-gray-800 sm:col-span-2">{saving ? "Saving…" : "Save"}</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
