import { cn } from '../../lib/cn';

export default function Field({ label, error, required = false, className, children }) {
  return (
    <div className={cn(className)}>
      {label ? (
        <label className="ui-field-label">
          {label} {required ? <span className="text-red-400">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
