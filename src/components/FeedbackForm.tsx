import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Send } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackFormProps {
  ticketId: string;
  onSubmit: (rating: number, comments: string) => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ ticketId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    onSubmit(rating, comments);
    toast.success('Thank you for your feedback!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 glass-card rounded-xl animate-slide-up">
      <div>
        <h3 className="text-lg font-semibold mb-2">How was your experience?</h3>
        <p className="text-sm text-muted-foreground">
          Your feedback helps us improve our support.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            className="transition-transform hover:scale-110 focus:outline-none"
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(value)}
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                value <= (hoverRating || rating)
                  ? 'fill-warning text-warning'
                  : 'text-muted-foreground'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {rating > 0 && (
            <>
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </>
          )}
        </span>
      </div>

      <Textarea
        placeholder="Tell us more about your experience (optional)"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        className="min-h-24 bg-input border-border"
      />

      <Button type="submit" className="w-full gap-2">
        <Send className="w-4 h-4" />
        Submit Feedback
      </Button>
    </form>
  );
};
