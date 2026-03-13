import { cn } from '../../lib/cn';

export default function PageHeader({ title, description, action, className }) {
  return (
    <div className={cn('ui-page-header', className)}>
      <div>
        <h1 className="ui-page-title text-gray-900 dark:text-gray-100">{title}</h1>
        {description ? <p className="ui-page-description">{description}</p> : null}
      </div>
      {action ? action : null}
    </div>
  );
}
