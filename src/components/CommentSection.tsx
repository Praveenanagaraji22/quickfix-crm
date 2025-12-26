import { useState } from 'react';
import { Comment, UserRole } from '@/types/crm';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { MessageSquare, Lock, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string, isInternal: boolean) => void;
}

const roleColors: Record<UserRole, string> = {
  admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  support: 'bg-info/20 text-info border-info/30',
  qa: 'bg-warning/20 text-warning border-warning/30',
  customer: 'bg-success/20 text-success border-success/30',
};

export const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment, isInternal);
      setNewComment('');
      setIsInternal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Comments & Activity</h3>
        <span className="text-sm text-muted-foreground">({comments.length})</span>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-lg animate-slide-up ${
                comment.isInternal
                  ? 'bg-warning/5 border border-warning/20'
                  : 'bg-secondary/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.userName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium border ${roleColors[comment.userRole]}`}
                  >
                    {comment.userRole}
                  </span>
                  {comment.isInternal && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-warning/20 text-warning">
                      <Lock className="w-3 h-3" />
                      Internal
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(comment.timestamp, 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              <p className="text-secondary-foreground">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-24 bg-input border-border"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="internal"
              checked={isInternal}
              onCheckedChange={(checked) => setIsInternal(checked as boolean)}
            />
            <label
              htmlFor="internal"
              className="text-sm text-muted-foreground cursor-pointer flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              Internal note (not visible to customer)
            </label>
          </div>
          <Button type="submit" disabled={!newComment.trim()}>
            <Send className="w-4 h-4" />
            Post Comment
          </Button>
        </div>
      </form>
    </div>
  );
};
