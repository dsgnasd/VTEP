import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

export default function Select({
  value,
  onChange,
  options,
  placeholder,
  className,
  triggerClassName,
  invalid = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((option) => (typeof option === 'string' ? option : option.value) === value);
  const label = selected ? (typeof selected === 'string' ? selected : selected.label) : null;

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        className={cn(
          'ui-select-trigger flex items-center justify-between gap-2 text-left',
          invalid && 'ui-select-trigger-error',
          triggerClassName
        )}
      >
        <span className={label ? '' : 'text-gray-400 dark:text-gray-500'}>
          {label || placeholder || 'Выберите'}
        </span>
        <svg className={cn('h-4 w-4 text-gray-400 transition-transform', open && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open ? (
        <div className="ui-select-popover">
          {placeholder ? (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              className="ui-select-option ui-select-option-idle text-gray-400 dark:text-gray-500"
            >
              {placeholder}
            </button>
          ) : null}
          {options.map((option) => {
            const optionValue = typeof option === 'string' ? option : option.value;
            const optionLabel = typeof option === 'string' ? option : option.label;
            const selectedOption = optionValue === value;

            return (
              <button
                key={optionValue}
                type="button"
                onClick={() => {
                  onChange(optionValue);
                  setOpen(false);
                }}
                className={cn(
                  'ui-select-option',
                  selectedOption ? 'ui-select-option-active' : 'ui-select-option-idle'
                )}
              >
                {optionLabel}
                {selectedOption ? (
                  <svg className="h-4 w-4 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
