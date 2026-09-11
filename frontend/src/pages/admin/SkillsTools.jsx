import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { useAdminList } from "@/hooks/usePortfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, Panel } from "@/components/admin/Shared";

const SortableItem = ({ item, index, testId, onDelete, onDrop }) => {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDrop}
      data-testid={`${testId}-item-${index}`}
      className="flex select-none items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-800 shadow-[0_0_0_0_transparent] transition-shadow [&[data-dragging=true]]:shadow-lift"
      whileDrag={{ scale: 1.02, backgroundColor: "#fff", boxShadow: "0 20px 40px rgb(0 0 0 / 0.12)" }}
    >
      <span className="flex items-center gap-2">
        <button type="button" aria-label="Drag to reorder" data-testid={`${testId}-drag-${index}`} onPointerDown={(e) => controls.start(e)} className="cursor-grab touch-none rounded p-1 text-gray-400 hover:text-gray-700 active:cursor-grabbing">
          <GripVertical size={14} />
        </button>
        {item.name}
      </span>
      <button type="button" data-testid={`${testId}-delete-${index}`} aria-label="Delete" onClick={onDelete} className="rounded p-1 text-gray-400 hover:bg-rose-soft hover:text-rose"><Trash2 size={14} /></button>
    </Reorder.Item>
  );
};

const ListEditor = ({ resource, title, filter = () => true, extra = {}, testId }) => {
  const qc = useQueryClient();
  const { data } = useAdminList(resource);
  const [items, setItems] = useState([]);
  const latest = useRef([]);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!data) return;
    const next = data.filter(filter);
    setItems(next);
    latest.current = next;
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const all = data || [];
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
      await api.post(`/admin/${resource}`, { name: name.trim(), order: all.length, ...extra });
      setName("");
    });
  };
  const remove = (id) => run(() => api.delete(`/admin/${resource}/${id}`));
  const onReorder = (next) => { setItems(next); latest.current = next; };
  const persist = () => {
    const otherIds = all.filter((d) => !filter(d)).map((d) => d.id);
    run(() => api.put(`/admin/${resource}/reorder`, { ids: [...latest.current.map((i) => i.id), ...otherIds] }));
  };

  return (
    <Panel title={title} className="flex flex-col">
      <Reorder.Group axis="y" values={items} onReorder={onReorder} className="space-y-2" data-testid={`${testId}-list`}>
        {items.map((item, i) => (
          <SortableItem key={item.id} item={item} index={i} testId={testId} onDelete={() => remove(item.id)} onDrop={persist} />
        ))}
      </Reorder.Group>
      {items.length === 0 && <p className="text-sm text-gray-400">Belum ada item.</p>}
      <p className="mt-3 text-xs text-gray-400">Tarik ikon ⋮⋮ untuk mengubah urutan.</p>
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
      <PageHeader title="Skills & Tools" description="Tambah, hapus, dan tarik untuk mengurutkan. Perubahan langsung tampil di halaman publik." />
      <div className="grid gap-6 lg:grid-cols-3">
        <ListEditor resource="skills" title="Hard Skills" filter={(s) => s.type === "hard"} extra={{ type: "hard" }} testId="hard-skills" />
        <ListEditor resource="skills" title="Soft Skills" filter={(s) => s.type === "soft"} extra={{ type: "soft" }} testId="soft-skills" />
        <ListEditor resource="tools" title="Tools" testId="tools" />
      </div>
    </div>
  );
}
