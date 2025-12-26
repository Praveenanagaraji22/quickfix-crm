import { TicketStatus, TicketPriority } from '@/types/crm';
import { Circle } from 'lucide-react';

interface StatusBadgeProps {
  status: TicketStatus;
}

interface PriorityBadgeProps {
  priority: TicketPriority;
}

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  'open': { label: 'Open', className: 'status-open' },
  'in-progress': { label: 'In Progress', className: 'status-in-progress' },
  'under-qa': { label: 'Under QA', className: 'status-under-qa' },
  'resolved': { label: 'Resolved', className: 'status-resolved' },
  'closed': { label: 'Closed', className: 'status-closed' },
};

const priorityConfig: Record<TicketPriority, { label: string; className: string }> = {
  'critical': { label: 'Critical', className: 'priority-critical' },
  'high': { label: 'High', className: 'priority-high' },
  'medium': { label: 'Medium', className: 'priority-medium' },
  'low': { label: 'Low', className: 'priority-low' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  return (
    <span className={`status-badge ${config.className}`}>
      <Circle className="w-2 h-2 fill-current" />
      {config.label}
    </span>
  );
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config = priorityConfig[priority];
  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  );
};
