export type UserRole = 'admin' | 'support' | 'qa' | 'customer';

export type TicketStatus = 'open' | 'in-progress' | 'under-qa' | 'resolved' | 'closed';

export type TicketPriority = 'critical' | 'high' | 'medium' | 'low';

export type TicketCategory = 'bug' | 'feature' | 'support' | 'billing' | 'general';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: string;
  assignedTo?: string;
  customerName: string;
  customerEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  timestamp: Date;
  isInternal: boolean;
}

export interface Feedback {
  id: string;
  ticketId: string;
  rating: number;
  comments: string;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  ticketId: string;
  timestamp: Date;
  details?: string;
}
