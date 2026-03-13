import Card from './Card';
import Tabs from './Tabs';
import { cn } from '../../lib/cn';

export default function TabbedCard({
  as = 'section',
  tabs,
  value,
  onChange,
  headerAction,
  divider = false,
  tabsInside = false,
  className,
  headerClassName,
  dividerClassName,
  bodyClassName,
  tabsListClassName = 'gap-1 p-0',
  tabsTriggerClassName = 'px-2.5 sm:px-3 py-1.5',
  children,
}) {
  const tabsNode = (
    <Tabs
      tabs={tabs}
      value={value}
      onChange={onChange}
      listClassName={tabsListClassName}
      triggerClassName={tabsTriggerClassName}
    />
  );

  return (
    <Card as={as} padding="none" className={cn('overflow-hidden', className)}>
      {!tabsInside ? (
        <>
          <div className={cn('flex items-center justify-between', headerClassName || 'px-5 py-4 sm:px-6')}>
            <div className="min-w-0 flex-1">{tabsNode}</div>
            {headerAction ? <div className="ml-3 flex-shrink-0">{headerAction}</div> : null}
          </div>
          {divider ? (
            <div className={cn('border-b border-gray-100 dark:border-gray-700/70', dividerClassName || 'mx-5 sm:mx-6')} />
          ) : null}
        </>
      ) : null}
      <div className={cn(bodyClassName || 'px-5 py-4 sm:px-6')}>
        {tabsInside ? (
          <>
            <div className={cn('min-w-0', headerClassName)}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">{tabsNode}</div>
                {headerAction ? <div className="flex-shrink-0">{headerAction}</div> : null}
              </div>
            </div>
            {divider ? (
              <div className={cn('mt-4 border-b border-gray-100 dark:border-gray-700/70', dividerClassName)} />
            ) : null}
          </>
        ) : null}
        {children}
      </div>
    </Card>
  );
}
