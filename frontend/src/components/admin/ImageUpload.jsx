import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { api, assetUrl, formatApiError } from "@/lib/api";

export const uploadImage = async (file) => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post("/admin/upload/image", form, { headers: { "Content-Type": "multipart/form-data" } });
  return data.url;
};

export const ImageUpload = ({ value, onChange, label = "Upload image", aspect = "aspect-video", testId = "image-upload" }) => {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  const handle = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadImage(file));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className={`relative overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50 ${aspect}`}>
        {value ? (
          <>
            <img src={assetUrl(value)} alt="" className="h-full w-full object-cover" />
            <button type="button" data-testid={`${testId}-remove`} onClick={() => onChange("")} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-white">
              <X size={14} />
            </button>
          </>
        ) : (
          <button type="button" data-testid={`${testId}-trigger`} onClick={() => inputRef.current?.click()} className="flex h-full w-full flex-col items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-800">
            {busy ? <Loader2 className="animate-spin" /> : <ImagePlus />}
            {label}
          </button>
        )}
      </div>
      {value && (
        <button type="button" data-testid={`${testId}-replace`} onClick={() => inputRef.current?.click()} className="text-xs font-medium text-brand-blue hover:underline" disabled={busy}>
          {busy ? "Uploading…" : "Replace image"}
        </button>
      )}
      <input ref={inputRef} data-testid={`${testId}-input`} type="file" accept="image/*" className="hidden" onChange={handle} />
    </div>
  );
};
