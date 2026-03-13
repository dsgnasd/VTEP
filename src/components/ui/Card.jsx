import { cn } from '../../lib/cn';

const PADDING_CLASS = {
  none: '',
  sm: 'p-4',
  md: 'ui-card-section',
  lg: 'p-6 sm:p-7',
};

export default function Card({
  as: Component = 'div',
  padding = 'md',
  muted = false,
  hoverable = false,
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        muted ? 'ui-card-muted' : 'ui-card',
        hoverable && 'ui-card-hover',
        PADDING_CLASS[padding] || PADDING_CLASS.md,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
