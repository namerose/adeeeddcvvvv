import { z } from 'zod';

// Schema definitions
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  avatar: z.string(),
  createdAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

// Storage keys
const STORAGE_KEYS = {
  USERS: 'project_launch_users',
  SESSION: 'project_launch_session',
} as const;

// Storage utilities
export const storage = {
  getUsers: (): User[] => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  saveUser: (user: User) => {
    const users = storage.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  findUserByEmail: (email: string): User | undefined => {
    return storage.getUsers().find(user => user.email === email);
  },

  // Session management
  getSession: (): User | null => {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  },

  saveSession: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  },

  clearSession: () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },
};