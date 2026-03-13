import { cn } from '../../lib/cn';

export default function EmptyState({ icon, title, description, action, className }) {
  return (
    <div className={cn('ui-empty-state', className)}>
      {icon ? <div className="ui-empty-state-icon">{icon}</div> : null}
      <p className="ui-empty-state-title">{title}</p>
      {description ? <p className="ui-empty-state-description">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
