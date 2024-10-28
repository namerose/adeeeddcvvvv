export interface Discussion {
  id: string;
  title: string;
  content?: string;
  type: 'discussion' | 'poll';
  category: string;
  subcategory: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt?: string;
  upvotes: number;
  voters: Set<string>;
  replies: Reply[];
  views: number;
  featured?: boolean;
  pollOptions?: PollOption[];
  pollVotes?: Record<string, Set<string>>;
  status: 'active' | 'locked' | 'hidden';
}

export interface Reply {
  id: string;
  discussionId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
  upvotes: number;
  voters: Set<string>;
  parentReplyId?: string;
}

export interface PollOption {
  id: string;
  text: string;
}