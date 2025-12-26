import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { CommentSection } from '@/components/CommentSection';
import { StatusControl } from '@/components/StatusControl';
import { FeedbackForm } from '@/components/FeedbackForm';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockTickets, mockComments, mockUsers } from '@/data/mockData';
import { Comment, TicketStatus } from '@/types/crm';
import { format } from 'date-fns';
import { ArrowLeft, User, Calendar, Tag, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const categoryLabels: Record<string, string> = {
  bug: 'Bug',
  feature: 'Feature Request',
  support: 'Support',
  billing: 'Billing',
  general: 'General',
};

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const ticket = useMemo(() => mockTickets.find((t) => t.id === id), [id]);
  const [currentStatus, setCurrentStatus] = useState<TicketStatus>(ticket?.status || 'open');
  const [assignedTo, setAssignedTo] = useState(ticket?.assignedTo || '');
  const [comments, setComments] = useState<Comment[]>(
    mockComments.filter((c) => c.ticketId === id)
  );
  const [showFeedback, setShowFeedback] = useState(false);

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ticket not found</h2>
            <p className="text-muted-foreground mb-4">
              The ticket you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const handleStatusChange = (status: TicketStatus) => {
    setCurrentStatus(status);
    toast.success(`Status updated to ${status.replace('-', ' ')}`);
    
    if (status === 'resolved') {
      setShowFeedback(true);
    }
  };

  const handleAssignChange = (userId: string) => {
    setAssignedTo(userId);
    const assignedUser = mockUsers.find((u) => u.id === userId);
    toast.success(`Ticket assigned to ${assignedUser?.name || 'Unassigned'}`);
  };

  const handleAddComment = (content: string, isInternal: boolean) => {
    const newComment: Comment = {
      id: `com-${Date.now()}`,
      ticketId: ticket.id,
      userId: user?.id || 'user-1',
      userName: user?.name || 'Admin User',
      userRole: user?.role || 'admin',
      content,
      timestamp: new Date(),
      isInternal,
    };
    setComments([...comments, newComment]);
    toast.success('Comment added');
  };

  const handleFeedbackSubmit = (rating: number, feedbackComments: string) => {
    console.log('Feedback submitted:', { rating, feedbackComments });
    setShowFeedback(false);
    setCurrentStatus('closed');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 rounded-xl animate-slide-up">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-primary text-sm">{ticket.id}</span>
                    <StatusBadge status={currentStatus} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                  <h1 className="text-2xl font-bold">{ticket.title}</h1>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-secondary-foreground">{ticket.description}</p>
              </div>
            </div>

            {/* Status Control */}
            <div className="glass-card p-6 rounded-xl animate-slide-up" style={{ animationDelay: '50ms' }}>
              <h3 className="text-lg font-semibold mb-4">Update Status</h3>
              <StatusControl
                currentStatus={currentStatus}
                onStatusChange={handleStatusChange}
              />
            </div>

            {/* Feedback Form */}
            {showFeedback && (
              <FeedbackForm ticketId={ticket.id} onSubmit={handleFeedbackSubmit} />
            )}

            {/* Comments */}
            <div className="glass-card p-6 rounded-xl animate-slide-up" style={{ animationDelay: '100ms' }}>
              <CommentSection comments={comments} onAddComment={handleAddComment} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-xl animate-slide-up" style={{ animationDelay: '150ms' }}>
              <h3 className="text-lg font-semibold mb-4">Ticket Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{ticket.customerName}</p>
                    <p className="text-sm text-muted-foreground">{ticket.customerEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{categoryLabels[ticket.category]}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{format(ticket.createdAt, 'MMM d, yyyy h:mm a')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{format(ticket.updatedAt, 'MMM d, yyyy h:mm a')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl animate-slide-up" style={{ animationDelay: '200ms' }}>
              <h3 className="text-lg font-semibold mb-4">Assignment</h3>
              <Select value={assignedTo} onValueChange={handleAssignChange}>
                <SelectTrigger className="bg-input">
                  <SelectValue placeholder="Assign to..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {mockUsers.filter((u) => u.role !== 'customer').map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketDetail;
