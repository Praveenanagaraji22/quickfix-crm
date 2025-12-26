import { TicketStatus } from '@/types/crm';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface StatusControlProps {
  currentStatus: TicketStatus;
  onStatusChange: (status: TicketStatus) => void;
}

const statusFlow: TicketStatus[] = ['open', 'in-progress', 'under-qa', 'resolved', 'closed'];

const statusLabels: Record<TicketStatus, string> = {
  'open': 'Open',
  'in-progress': 'In Progress',
  'under-qa': 'Under QA',
  'resolved': 'Resolved',
  'closed': 'Closed',
};

export const StatusControl: React.FC<StatusControlProps> = ({
  currentStatus,
  onStatusChange,
}) => {
  const currentIndex = statusFlow.indexOf(currentStatus);
  const nextStatus = currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={currentStatus} onValueChange={(value) => onStatusChange(value as TicketStatus)}>
          <SelectTrigger className="w-48 bg-input border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusFlow.map((status) => (
              <SelectItem key={status} value={status}>
                {statusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {nextStatus && (
          <Button
            variant="outline"
            onClick={() => onStatusChange(nextStatus)}
            className="gap-2"
          >
            Move to {statusLabels[nextStatus]}
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}

        {currentStatus === 'resolved' && (
          <Button
            onClick={() => onStatusChange('closed')}
            className="gap-2 bg-success text-success-foreground hover:bg-success/90"
          >
            <CheckCircle className="w-4 h-4" />
            Close Ticket
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {statusFlow.map((status, index) => (
          <div key={status} className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full transition-colors ${
                index <= currentIndex
                  ? 'bg-primary'
                  : 'bg-muted'
              }`}
            />
            {index < statusFlow.length - 1 && (
              <div
                className={`w-8 h-0.5 transition-colors ${
                  index < currentIndex
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
