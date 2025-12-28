import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useConversation, useAddFeedback } from '@/hooks/useDataHooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardSkeleton } from '@/components/shared/SkeletonLoader';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  ArrowLeft,
  User,
  Bot,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Globe,
  Smartphone,
  Send,
} from 'lucide-react';
import { formatDateTime, formatPercent } from '@/utils/helpers';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import type { Channel } from '@/types';

const channelIcons: Record<Channel, React.ReactNode> = {
  web: <Globe className="h-5 w-5" />,
  whatsapp: <Smartphone className="h-5 w-5" />,
  telegram: <Send className="h-5 w-5" />,
};

export default function ConversationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: conversation, isLoading } = useConversation(id!);
  const addFeedback = useAddFeedback();
  const { toast } = useToast();
  
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect'>('correct');
  const [feedbackNote, setFeedbackNote] = useState('');

  const handleFeedback = async () => {
    if (!id) return;
    
    try {
      await addFeedback.mutateAsync({
        id,
        feedback: {
          isCorrect: feedbackType === 'correct',
          note: feedbackNote || undefined,
        },
      });
      toast({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback.',
      });
      setFeedbackDialogOpen(false);
      setFeedbackNote('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit feedback.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <CardSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (!conversation) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Conversation not found</p>
          <Link to="/conversations">
            <Button variant="link">Go back to conversations</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/conversations">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {channelIcons[conversation.channel]}
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Conversation Details</h1>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(conversation.createdAt)} via {conversation.channel}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFeedbackType('correct');
                setFeedbackDialogOpen(true);
              }}
              className={conversation.feedback?.isCorrect === true ? 'border-success text-success' : ''}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Correct
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFeedbackType('incorrect');
                setFeedbackDialogOpen(true);
              }}
              className={conversation.feedback?.isCorrect === false ? 'border-destructive text-destructive' : ''}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              Incorrect
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Channel</p>
            <p className="font-medium text-foreground capitalize">{conversation.channel}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Confidence</p>
            <Badge 
              variant={conversation.confidenceScore >= 0.8 ? 'success' : conversation.confidenceScore >= 0.6 ? 'warning' : 'destructive'}
            >
              {formatPercent(conversation.confidenceScore * 100)}
            </Badge>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Messages</p>
            <p className="font-medium text-foreground">{conversation.messages.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Feedback</p>
            <p className="font-medium text-foreground">
              {conversation.feedback 
                ? (conversation.feedback.isCorrect ? 'Correct' : 'Incorrect')
                : 'Not reviewed'
              }
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Conversation</h2>
          </div>
          <div className="divide-y divide-border">
            {conversation.messages.map((message) => (
              <div key={message.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    message.role === 'user' ? 'bg-secondary' : 'bg-primary'
                  }`}>
                    {message.role === 'user' 
                      ? <User className="h-4 w-4 text-secondary-foreground" />
                      : <Bot className="h-4 w-4 text-primary-foreground" />
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground capitalize">
                        {message.role}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(message.timestamp)}
                      </span>
                      {message.confidenceScore && (
                        <Badge variant="ghost" className="text-xs">
                          {formatPercent(message.confidenceScore * 100)} confidence
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Retrieved Chunks */}
                    {message.retrievedChunks && message.retrievedChunks.length > 0 && (
                      <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">
                            Retrieved Chunks ({message.retrievedChunks.length})
                          </span>
                        </div>
                        <div className="space-y-2">
                          {message.retrievedChunks.map((chunk) => (
                            <div key={chunk.id} className="text-xs">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="secondary" className="text-[10px]">
                                  {chunk.source}
                                </Badge>
                                <span className="text-muted-foreground">
                                  Score: {(chunk.score * 100).toFixed(0)}%
                                </span>
                              </div>
                              <p className="text-muted-foreground">{chunk.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Note */}
        {conversation.feedback?.note && (
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-medium text-foreground mb-2">Feedback Note</h3>
            <p className="text-sm text-muted-foreground">{conversation.feedback.note}</p>
          </div>
        )}
      </div>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Mark as {feedbackType === 'correct' ? 'Correct' : 'Incorrect'}
            </DialogTitle>
            <DialogDescription>
              Add an optional note to explain your feedback.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Optional: Add a note about this response..."
            value={feedbackNote}
            onChange={(e) => setFeedbackNote(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={feedbackType === 'correct' ? 'success' : 'destructive'}
              onClick={handleFeedback}
            >
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
