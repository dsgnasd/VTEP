import { cn } from '../../lib/cn';

export default function Textarea({ className, invalid = false, ...props }) {
  return (
    <textarea
      className={cn('ui-textarea', invalid && 'ui-textarea-error', className)}
      {...props}
    />
  );
}
