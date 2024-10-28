import Dexie from 'dexie';
import { Project } from '@/types/project';
import { User } from '@/types/user';
import { Activity } from '@/types/activity';
import { Discussion } from '@/types/discussion';

class ProjectLaunchDB extends Dexie {
  projects: Dexie.Table<Project, string>;
  users: Dexie.Table<User, string>;
  activities: Dexie.Table<Activity, string>;
  discussions: Dexie.Table<Discussion, string>;

  constructor() {
    super('ProjectLaunchDB');
    
    // Define tables and indexes
    this.version(3).stores({
      projects: 'id, authorId, status, category, createdAt, updatedAt, *tags, *voters, *subscribers',
      users: 'id, email, username, role, status, createdAt, lastActive, isVerified, updatedAt',
      activities: 'id, userId, type, timestamp, projectId',
      discussions: 'id, type, category, author.id, createdAt, updatedAt, status, *tags'
    });

    // Define tables
    this.projects = this.table('projects');
    this.users = this.table('users');
    this.activities = this.table('activities');
    this.discussions = this.table('discussions');
  }
}

const db = new ProjectLaunchDB();

// Project operations
export const projectOperations = {
  async create(project: any) {
    if (!project) {
      throw new Error('Project data is required');
    }

    const timestamp = new Date().toISOString();
    return await db.projects.add({
      ...project,
      id: crypto.randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
      voters: [],
      subscribers: [],
      comments: [],
      upvotes: 0
    });
  },

  async update(project: any) {
    if (!project || !project.id) {
      throw new Error('Project ID is required');
    }

    const existingProject = await db.projects.get(project.id);
    if (!existingProject) {
      throw new Error('Project not found');
    }

    return await db.projects.update(project.id, {
      ...project,
      updatedAt: new Date().toISOString()
    });
  },

  async delete(projectId: string, authorId: string) {
    if (!projectId || !authorId) {
      throw new Error('Project ID and author ID are required');
    }

    const project = await db.projects.get(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (project.author?.id !== authorId) {
      throw new Error('Unauthorized: You can only delete your own projects');
    }

    // Begin transaction to delete project and related activities
    return await db.transaction('rw', [db.projects, db.activities], async () => {
      // Delete related activities first
      await db.activities.where('projectId').equals(projectId).delete();
      // Delete the project
      const deleteCount = await db.projects.delete(projectId);
      if (deleteCount === 0) {
        throw new Error('Failed to delete project');
      }
      return deleteCount;
    });
  },

  async getById(id: string) {
    if (!id) {
      throw new Error('Project ID is required');
    }

    const project = await db.projects.get(id);
    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  },

  async getByAuthor(authorId: string) {
    if (!authorId) {
      throw new Error('Author ID is required');
    }

    return await db.projects
      .where('author.id')
      .equals(authorId)
      .reverse()
      .sortBy('createdAt');
  },

  async getAll() {
    return await db.projects
      .orderBy('createdAt')
      .reverse()
      .toArray();
  },

  async toggleUpvote(projectId: string, userId: string) {
    if (!projectId || !userId) {
      throw new Error('Project ID and user ID are required');
    }

    return await db.transaction('rw', db.projects, async () => {
      const project = await db.projects.get(projectId);
      if (!project) {
        throw new Error('Project not found');
      }

      const voters = new Set(project.voters || []);
      const hasVoted = voters.has(userId);

      if (hasVoted) {
        voters.delete(userId);
      } else {
        voters.add(userId);
      }

      const upvotes = hasVoted ? project.upvotes - 1 : project.upvotes + 1;

      await db.projects.update(projectId, {
        upvotes,
        voters: Array.from(voters),
        updatedAt: new Date().toISOString()
      });

      return { ...project, upvotes, voters };
    });
  },

  async addComment(projectId: string, comment: any) {
    if (!projectId || !comment) {
      throw new Error('Project ID and comment data are required');
    }

    return await db.transaction('rw', db.projects, async () => {
      const project = await db.projects.get(projectId);
      if (!project) {
        throw new Error('Project not found');
      }

      const updatedProject = {
        ...project,
        comments: [...(project.comments || []), comment],
        updatedAt: new Date().toISOString()
      };

      await db.projects.update(projectId, updatedProject);
      return updatedProject;
    });
  }
};

// User operations
export const userOperations = {
  async create(user: any) {
    const timestamp = new Date().toISOString();
    return await db.users.add({
      ...user,
      id: crypto.randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
      lastActive: timestamp,
      status: 'active',
      isVerified: false,
      role: user.role || 'user'
    });
  },

  async update(userId: string, data: any) {
    return await db.users.update(userId, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  },

  async getById(id: string) {
    return await db.users.get(id);
  },

  async getByEmail(email: string) {
    return await db.users
      .where('email')
      .equals(email)
      .first();
  },

  async getByUsername(username: string) {
    return await db.users
      .where('username')
      .equals(username)
      .first();
  },

  async getAll() {
    return await db.users
      .orderBy('createdAt')
      .reverse()
      .toArray();
  },

  async updateRole(userId: string, role: string) {
    const timestamp = new Date().toISOString();
    await db.users.update(userId, { 
      role,
      updatedAt: timestamp
    });
    await activityOperations.log({
      type: 'role_change',
      userId,
      data: { role },
      timestamp
    });
  },

  async updateStatus(userId: string, status: string) {
    const timestamp = new Date().toISOString();
    await db.users.update(userId, { 
      status,
      updatedAt: timestamp,
      lastActive: timestamp
    });
    await activityOperations.log({
      type: 'status_change',
      userId,
      data: { status },
      timestamp
    });
  }
};

// Activity logging
export const activityOperations = {
  async log(activity: any) {
    return await db.activities.add({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...activity
    });
  },

  async getRecent(limit = 10) {
    return await db.activities
      .orderBy('timestamp')
      .reverse()
      .limit(limit)
      .toArray();
  },

  async getByUser(userId: string) {
    return await db.activities
      .where('userId')
      .equals(userId)
      .reverse()
      .sortBy('timestamp');
  },

  async getByType(type: string) {
    return await db.activities
      .where('type')
      .equals(type)
      .reverse()
      .sortBy('timestamp');
  }
};

// Discussion operations
export const discussionOperations = {
  async create(discussion: Omit<Discussion, 'id' | 'createdAt' | 'upvotes' | 'voters' | 'replies' | 'views'>) {
    const timestamp = new Date().toISOString();
    const newDiscussion: Discussion = {
      ...discussion,
      id: crypto.randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
      upvotes: 0,
      voters: new Set(),
      replies: [],
      views: 0,
      status: 'active'
    };

    await db.discussions.add(newDiscussion);
    return newDiscussion;
  },

  async update(discussionId: string, data: Partial<Discussion>) {
    const discussion = await db.discussions.get(discussionId);
    if (!discussion) throw new Error('Discussion not found');

    const updatedDiscussion = {
      ...discussion,
      ...data,
      updatedAt: new Date().toISOString()
    };

    await db.discussions.put(updatedDiscussion);
    return updatedDiscussion;
  },

  async delete(discussionId: string, userId: string) {
    const discussion = await db.discussions.get(discussionId);
    if (!discussion) throw new Error('Discussion not found');
    if (discussion.author.id !== userId) throw new Error('Unauthorized');

    await db.discussions.delete(discussionId);
  },

  async getById(id: string) {
    return await db.discussions.get(id);
  },

  async getAll() {
    return await db.discussions
      .orderBy('createdAt')
      .reverse()
      .toArray();
  },

  async addReply(discussionId: string, reply: any) {
    return await db.transaction('rw', db.discussions, async () => {
      const discussion = await db.discussions.get(discussionId);
      if (!discussion) throw new Error('Discussion not found');

      const newReply = {
        ...reply,
        id: crypto.randomUUID(),
        discussionId,
        createdAt: new Date().toISOString(),
        upvotes: 0,
        voters: new Set()
      };

      const updatedDiscussion = {
        ...discussion,
        replies: [...discussion.replies, newReply],
        updatedAt: new Date().toISOString()
      };

      await db.discussions.put(updatedDiscussion);
      return newReply;
    });
  },

  async toggleUpvote(discussionId: string, userId: string) {
    return await db.transaction('rw', db.discussions, async () => {
      const discussion = await db.discussions.get(discussionId);
      if (!discussion) throw new Error('Discussion not found');

      const voters = new Set(discussion.voters);
      const hasVoted = voters.has(userId);

      if (hasVoted) {
        voters.delete(userId);
      } else {
        voters.add(userId);
      }

      const upvotes = hasVoted ? discussion.upvotes - 1 : discussion.upvotes + 1;

      const updatedDiscussion = {
        ...discussion,
        upvotes,
        voters,
        updatedAt: new Date().toISOString()
      };

      await db.discussions.put(updatedDiscussion);
      return updatedDiscussion;
    });
  },

  async incrementViews(discussionId: string) {
    return await db.transaction('rw', db.discussions, async () => {
      const discussion = await db.discussions.get(discussionId);
      if (!discussion) throw new Error('Discussion not found');

      const updatedDiscussion = {
        ...discussion,
        views: discussion.views + 1
      };

      await db.discussions.put(updatedDiscussion);
      return updatedDiscussion;
    });
  },

  async votePoll(discussionId: string, optionId: string, userId: string) {
    return await db.transaction('rw', db.discussions, async () => {
      const discussion = await db.discussions.get(discussionId);
      if (!discussion || !discussion.pollVotes) throw new Error('Invalid poll');

      // Remove previous vote if any
      Object.values(discussion.pollVotes).forEach(votes => votes.delete(userId));

      // Add new vote
      discussion.pollVotes[optionId].add(userId);

      const updatedDiscussion = {
        ...discussion,
        updatedAt: new Date().toISOString()
      };

      await db.discussions.put(updatedDiscussion);
      return updatedDiscussion;
    });
  }
};

export default db;