import { cn } from '../../lib/cn';

const SIZE_CLASS = {
  sm: 'ui-button-sm',
  md: 'ui-button-md',
  lg: 'ui-button-lg',
};

const VARIANT_CLASS = {
  primary: 'ui-button-primary',
  secondary: 'ui-button-secondary',
  success: 'ui-button-success',
  ghost: 'ui-button-ghost',
};

export default function Button({
  as: Component = 'button',
  type = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <Component
      type={Component === 'button' ? type : undefined}
      className={cn('ui-button', SIZE_CLASS[size] || SIZE_CLASS.md, VARIANT_CLASS[variant] || VARIANT_CLASS.primary, className)}
      {...props}
    >
      {children}
    </Component>
  );
}
