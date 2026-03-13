import Card from './Card';
import Tabs from './Tabs';
import { cn } from '../../lib/cn';

export default function TabbedCard({
  as = 'section',
  tabs,
  value,
  onChange,
  headerAction,
  className,
  headerClassName,
  bodyClassName,
  tabsListClassName = 'gap-1 p-0',
  tabsTriggerClassName = 'px-2.5 sm:px-3 py-1.5',
  children,
}) {
  return (
    <Card as={as} padding="none" className={cn('overflow-hidden', className)}>
      <div className={cn('ui-card-header px-3 sm:px-4 py-3 border-b border-gray-100 dark:border-gray-700/70', headerClassName)}>
        <div className="min-w-0 flex-1">
          <Tabs
            tabs={tabs}
            value={value}
            onChange={onChange}
            listClassName={tabsListClassName}
            triggerClassName={tabsTriggerClassName}
          />
        </div>
        {headerAction ? <div className="ml-3 flex-shrink-0">{headerAction}</div> : null}
      </div>
      <div className={cn('ui-card-body px-3 sm:px-4 pt-4', bodyClassName)}>
        {children}
      </div>
    </Card>
  );
}
