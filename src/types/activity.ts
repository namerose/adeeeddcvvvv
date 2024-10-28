export type ActivityType = 
  | 'project_launch' 
  | 'project_upvote'
  | 'comment'
  | 'discussion'
  | 'badge_earned'
  | 'skill_endorsed';

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  timestamp: string;
  data: {
    projectId?: string;
    projectTitle?: string;
    discussionId?: string;
    discussionTitle?: string;
    commentId?: string;
    commentText?: string;
    badgeId?: string;
    badgeName?: string;
    skillId?: string;
    skillName?: string;
  };
}