import { useRef, useState } from "react";
import { FileText, Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { api, assetUrl, formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Field, PageHeader, Panel } from "@/components/admin/Shared";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useProfileForm } from "./ProfileEditor";

const PasswordPanel = () => {
  const [form, setForm] = useState({ current_password: "", new_password: "" });
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.put("/auth/password", form);
      toast.success("Password updated");
      setForm({ current_password: "", new_password: "" });
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Panel title="Change password">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field id="current-password" label="Current password" type="password" value={form.current_password} onChange={(e) => setForm({ ...form, current_password: e.target.value })} required />
        <Field id="new-password" label="New password" type="password" minLength={8} value={form.new_password} onChange={(e) => setForm({ ...form, new_password: e.target.value })} required />
        <Button data-testid="password-save-btn" type="submit" variant="outline" disabled={busy} className="h-11 rounded-xl sm:col-span-2">{busy ? "Updating…" : "Update password"}</Button>
      </form>
    </Panel>
  );
};

export default function Settings() {
  const { form, setForm, set, save, saving } = useProfileForm();
  const cvRef = useRef(null);
  const [cvBusy, setCvBusy] = useState(false);
  if (!form) return null;

  const setSeo = (key) => (e) => setForm((f) => ({ ...f, seo: { ...f.seo, [key]: e?.target ? e.target.value : e } }));
  const setSocial = (i, key, value) => setForm((f) => ({ ...f, social_links: f.social_links.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)) }));

  const uploadCv = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvBusy(true);
    const data = new FormData();
    data.append("file", file);
    try {
      const { data: profile } = await api.post("/admin/upload/cv", data, { headers: { "Content-Type": "multipart/form-data" } });
      setForm((f) => ({ ...f, cv_url: profile.cv_url }));
      toast.success("CV uploaded");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setCvBusy(false);
      e.target.value = "";
    }
  };

  return (
    <form data-testid="settings-page" onSubmit={(e) => { e.preventDefault(); save(); }}>
      <PageHeader title="Settings" description="Kontak, social link, CV, dan SEO / Open Graph.">
        <Button data-testid="settings-save-btn" type="submit" disabled={saving} className="h-10 rounded-xl bg-ink px-6 text-white hover:bg-gray-800">{saving ? "Saving…" : "Save changes"}</Button>
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Contact">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field id="contact-email" label="Email" type="email" value={form.email} onChange={set("email")} />
              <Field id="contact-phone" label="Phone" value={form.phone} onChange={set("phone")} />
              <Field id="contact-location" label="Location" value={form.location} onChange={set("location")} />
            </div>
          </Panel>
          <Panel title="Social links">
            <div className="space-y-3" data-testid="social-links-editor">
              {form.social_links.map((s, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
                  <input data-testid={`social-label-${i}`} placeholder="Label" value={s.label} onChange={(e) => setSocial(i, "label", e.target.value)} className="h-10 rounded-xl border border-gray-200 px-3 text-sm" />
                  <input data-testid={`social-url-${i}`} placeholder="https://" value={s.url} onChange={(e) => setSocial(i, "url", e.target.value)} className="h-10 rounded-xl border border-gray-200 px-3 text-sm" />
                  <button type="button" onClick={() => setForm((f) => ({ ...f, social_links: f.social_links.filter((_, idx) => idx !== i) }))} className="grid h-10 w-10 place-items-center rounded-xl text-gray-400 hover:bg-rose-soft hover:text-rose"><X size={14} /></button>
                </div>
              ))}
              <Button type="button" variant="outline" data-testid="social-add-btn" onClick={() => setForm((f) => ({ ...f, social_links: [...f.social_links, { label: "", url: "" }] }))} className="rounded-xl"><Plus size={14} className="mr-1" /> Add link</Button>
            </div>
          </Panel>
          <Panel title="SEO & Open Graph">
            <div className="grid gap-4">
              <Field id="seo-title" label="Meta title" value={form.seo.title} onChange={setSeo("title")} />
              <Field id="seo-description" label="Meta description" textarea value={form.seo.description} onChange={setSeo("description")} />
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Share image (OG)</p>
                <ImageUpload value={form.seo.og_image} onChange={setSeo("og_image")} aspect="aspect-[1.91/1]" label="Upload share image" testId="og-upload" />
              </div>
            </div>
          </Panel>
          <PasswordPanel />
        </div>
        <Panel title="CV / Resume (PDF)" className="h-fit">
          {form.cv_url ? (
            <a data-testid="cv-current-link" href={assetUrl(form.cv_url)} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100">
              <FileText size={18} className="text-brand-blue" /> Lihat CV saat ini
            </a>
          ) : (
            <p className="text-sm text-gray-400">Belum ada CV.</p>
          )}
          <Button type="button" variant="outline" data-testid="cv-upload-btn" disabled={cvBusy} onClick={() => cvRef.current?.click()} className="mt-4 w-full rounded-xl">
            <Upload size={14} className="mr-2" /> {cvBusy ? "Uploading…" : form.cv_url ? "Replace PDF" : "Upload PDF"}
          </Button>
          <input ref={cvRef} data-testid="cv-file-input" type="file" accept="application/pdf" className="hidden" onChange={uploadCv} />
        </Panel>
      </div>
    </form>
  );
}
