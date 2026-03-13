import { cn } from '../../lib/cn';

export default function Input({ className, invalid = false, ...props }) {
  return (
    <input
      className={cn('ui-input', invalid && 'ui-input-error', className)}
      {...props}
    />
  );
}
