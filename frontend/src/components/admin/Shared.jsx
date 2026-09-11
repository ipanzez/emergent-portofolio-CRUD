import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const PageHeader = ({ title, description, children }) => (
  <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">{title}</h1>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
    {children && <div className="flex gap-2">{children}</div>}
  </div>
);

export const Field = ({ label, id, hint, textarea = false, className = "", ...props }) => (
  <div className={`space-y-1.5 ${className}`}>
    <Label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</Label>
    {textarea ? <Textarea id={id} data-testid={`${id}-input`} className="min-h-[110px] rounded-xl bg-white" {...props} /> : <Input id={id} data-testid={`${id}-input`} className="h-11 rounded-xl bg-white" {...props} />}
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
);

export const Panel = ({ title, children, className = "" }) => (
  <section className={`card-soft p-6 md:p-8 ${className}`}>
    {title && <h2 className="mb-6 text-lg font-bold text-gray-900">{title}</h2>}
    {children}
  </section>
);
