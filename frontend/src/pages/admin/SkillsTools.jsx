import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { useAdminList } from "@/hooks/usePortfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, Panel } from "@/components/admin/Shared";

const ListEditor = ({ resource, title, filter = () => true, extra = {}, testId }) => {
  const qc = useQueryClient();
  const { data = [] } = useAdminList(resource);
  const items = data.filter(filter);
  const [name, setName] = useState("");

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin", resource] });
    qc.invalidateQueries({ queryKey: ["portfolio"] });
  };
  const run = async (fn) => {
    try { await fn(); refresh(); } catch (err) { toast.error(formatApiError(err)); }
  };
  const add = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    run(async () => {
      await api.post(`/admin/${resource}`, { name: name.trim(), order: data.length, ...extra });
      setName("");
    });
  };
  const remove = (id) => run(() => api.delete(`/admin/${resource}/${id}`));
  const move = (index, dir) => {
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(index + dir, 0, moved);
    const otherIds = data.filter((d) => !filter(d)).map((d) => d.id);
    run(() => api.put(`/admin/${resource}/reorder`, { ids: [...next.map((i) => i.id), ...otherIds] }));
  };

  return (
    <Panel title={title} className="flex flex-col">
      <ul className="space-y-2" data-testid={`${testId}-list`}>
        {items.map((item, i) => (
          <li key={item.id} data-testid={`${testId}-item-${i}`} className="flex items-center justify-between rounded-xl bg-gray-50 px-3.5 py-2.5 text-sm font-medium text-gray-800">
            <span>{item.name}</span>
            <span className="flex items-center gap-1 text-gray-400">
              <button type="button" aria-label="Move up" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 hover:bg-gray-200 disabled:opacity-30"><ArrowUp size={14} /></button>
              <button type="button" aria-label="Move down" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="rounded p-1 hover:bg-gray-200 disabled:opacity-30"><ArrowDown size={14} /></button>
              <button type="button" data-testid={`${testId}-delete-${i}`} aria-label="Delete" onClick={() => remove(item.id)} className="rounded p-1 hover:bg-rose-soft hover:text-rose"><Trash2 size={14} /></button>
            </span>
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-gray-400">Belum ada item.</li>}
      </ul>
      <form onSubmit={add} className="mt-4 flex gap-2">
        <Input data-testid={`${testId}-input`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama baru…" className="h-10 rounded-xl bg-white" />
        <Button data-testid={`${testId}-add-btn`} type="submit" className="h-10 rounded-xl bg-ink px-4 text-white hover:bg-gray-800"><Plus size={16} /></Button>
      </form>
    </Panel>
  );
};

export default function SkillsTools() {
  return (
    <div data-testid="skills-tools-page">
      <PageHeader title="Skills & Tools" description="Tambah, hapus, dan urutkan. Perubahan langsung tampil di halaman publik." />
      <div className="grid gap-6 lg:grid-cols-3">
        <ListEditor resource="skills" title="Hard Skills" filter={(s) => s.type === "hard"} extra={{ type: "hard" }} testId="hard-skills" />
        <ListEditor resource="skills" title="Soft Skills" filter={(s) => s.type === "soft"} extra={{ type: "soft" }} testId="soft-skills" />
        <ListEditor resource="tools" title="Tools" testId="tools" />
      </div>
    </div>
  );
}
