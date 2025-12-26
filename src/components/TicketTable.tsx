import { Ticket } from '@/types/crm';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { mockUsers } from '@/data/mockData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TicketTableProps {
  tickets: Ticket[];
}

const categoryLabels: Record<string, string> = {
  bug: 'Bug',
  feature: 'Feature',
  support: 'Support',
  billing: 'Billing',
  general: 'General',
};

export const TicketTable: React.FC<TicketTableProps> = ({ tickets }) => {
  const navigate = useNavigate();

  const getAssignedUser = (userId?: string) => {
    if (!userId) return '—';
    const user = mockUsers.find(u => u.id === userId);
    return user?.name || '—';
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead className="text-muted-foreground font-semibold">Ticket ID</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Customer</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Issue Title</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Category</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Priority</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Assigned To</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket, index) => (
            <TableRow
              key={ticket.id}
              className="table-row-hover border-border/30"
              onClick={() => navigate(`/ticket/${ticket.id}`)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell className="font-mono text-primary font-medium">
                {ticket.id}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{ticket.customerName}</p>
                  <p className="text-sm text-muted-foreground">{ticket.customerEmail}</p>
                </div>
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="truncate font-medium">{ticket.title}</p>
              </TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                  {categoryLabels[ticket.category]}
                </span>
              </TableCell>
              <TableCell>
                <PriorityBadge priority={ticket.priority} />
              </TableCell>
              <TableCell>
                <StatusBadge status={ticket.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getAssignedUser(ticket.assignedTo)}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {format(ticket.updatedAt, 'MMM d, yyyy')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
