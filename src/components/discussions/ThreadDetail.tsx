import { useState, useEffect } from 'react';
import { useDiscussions } from '@/context/DiscussionContext';
import { Thread } from './Thread';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ReplyCard } from './ReplyCard';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from '@/hooks/use-navigate';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ThreadDetailProps {
  threadId: string;
}

export function ThreadDetail({ threadId }: ThreadDetailProps) {
  const [thread, setThread] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { getDiscussionById, addReply } = useDiscussions();
  const { user } = useAuth();
  const { navigate } = useNavigate();

  useEffect(() => {
    async function loadThread() {
      try {
        setLoading(true);
        setError(null);
        const threadData = await getDiscussionById(threadId);
        if (!threadData) {
          throw new Error('Discussion not found');
        }
        setThread(threadData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load discussion');
      } finally {
        setLoading(false);
      }
    }

    if (threadId) {
      loadThread();
    }
  }, [threadId, getDiscussionById]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyContent.trim()) return;

    try {
      await addReply(threadId, {
        author: {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        },
        content: replyContent,
        discussionId: threadId
      });
      setReplyContent('');
      
      // Refresh thread data to show new reply
      const updatedThread = await getDiscussionById(threadId);
      if (updatedThread) {
        setThread(updatedThread);
      }
    } catch (err) {
      console.error('Failed to add reply:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
          <Skeleton className="h-24 w-full" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/discussions')}
        >
          Back to Discussions
        </Button>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="max-w-3xl mx-auto">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>This discussion could not be found.</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/discussions')}
        >
          Back to Discussions
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Main Thread */}
      <Thread thread={thread} preview={false} />

      {/* Reply Form */}
      {user && (
        <form onSubmit={handleReply} className="p-6 border rounded-lg bg-background">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[100px] mb-2"
              />
              <Button type="submit" disabled={!replyContent.trim()}>
                Reply
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Replies */}
      <div className="space-y-4">
        {thread.replies?.map((reply: any) => (
          <ReplyCard key={reply.id} reply={reply} />
        ))}
      </div>
    </div>
  );
}