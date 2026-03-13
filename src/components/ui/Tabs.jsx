import { cn } from '../../lib/cn';

export default function Tabs({
  tabs,
  value,
  onChange,
  className,
  listClassName,
  triggerClassName,
}) {
  return (
    <div className={cn(className)}>
      <div className={cn('ui-tab-list', listClassName)}>
        {tabs.map((tab) => {
          const tabValue = typeof tab === 'string' ? tab : tab.value;
          const label = typeof tab === 'string' ? tab : tab.label;
          const meta = typeof tab === 'string' ? null : tab.meta;
          const active = value === tabValue;

          return (
            <button
              key={tabValue}
              type="button"
              onClick={() => onChange(tabValue)}
              className={cn(
                'ui-tab-trigger',
                active ? 'ui-tab-trigger-active' : 'ui-tab-trigger-idle',
                triggerClassName
              )}
            >
              <span>{label}</span>
              {meta ? <span className="ml-1.5 text-[11px] opacity-70">{meta}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
