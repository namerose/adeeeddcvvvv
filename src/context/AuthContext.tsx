import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ProfileUpdateData } from '@/types/user';
import { useToast } from '@/hooks/use-toast';
import { ProfileTheme } from '@/types/profile-theme';
import { uploadImage } from '@/lib/upload';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (userId: string, data: ProfileUpdateData) => Promise<boolean>;
  updateTheme: (userId: string, theme: ProfileTheme) => Promise<boolean>;
  updateAvatar: (userId: string, file: File) => Promise<boolean>;
  removeAvatar: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'project_launch_users',
  SESSION: 'project_launch_session',
} as const;

// Add demo admin user if none exists
const initializeAdminUser = () => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const adminExists = users.some((u: User) => u.isAdmin);

  if (!adminExists) {
    const adminUser = {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // In production, use hashed passwords
      username: 'admin',
      avatar: 'https://avatar.vercel.sh/admin',
      createdAt: new Date().toISOString(),
      isAdmin: true,
      isVerified: true
    };
    users.push(adminUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Initialize admin user and load session
  useEffect(() => {
    initializeAdminUser();
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  const updateTheme = async (userId: string, theme: ProfileTheme) => {
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      
      const updatedUsers = users.map((u: User) => 
        u.id === userId ? { ...u, theme } : u
      );

      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

      if (user?.id === userId) {
        const updatedUser = { ...user, theme };
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updatedUser));
      }

      toast({
        title: "Theme updated",
        description: "Your profile theme has been updated successfully.",
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update theme. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProfile = async (userId: string, data: ProfileUpdateData) => {
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      
      const updatedUsers = users.map((u: User) => 
        u.id === userId ? { ...u, ...data } : u
      );

      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

      // Update current user if it's the same user
      if (user?.id === userId) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updatedUser));
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateAvatar = async (userId: string, file: File): Promise<boolean> => {
    try {
      const avatarUrl = await uploadImage(file);
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      
      const updatedUsers = users.map((u: User) => 
        u.id === userId ? { ...u, avatar: avatarUrl } : u
      );

      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

      if (user?.id === userId) {
        const updatedUser = { ...user, avatar: avatarUrl };
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updatedUser));
      }

      return true;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  };

  const removeAvatar = async (userId: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const defaultAvatar = `https://avatar.vercel.sh/${userId}`;
      
      const updatedUsers = users.map((u: User) => 
        u.id === userId ? { ...u, avatar: defaultAvatar } : u
      );

      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

      if (user?.id === userId) {
        const updatedUser = { ...user, avatar: defaultAvatar };
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updatedUser));
      }

      return true;
    } catch (error) {
      console.error('Error removing avatar:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find((u: User) => u.email === email);
    
    if (!user || user.password !== password) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      return false;
    }

    const { password: _, ...userWithoutPassword } = user;
    setUser(userWithoutPassword);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(userWithoutPassword));
    
    toast({
      title: "Welcome back!",
      description: "You have successfully logged in.",
    });
    return true;
  };

  const register = async (name: string, email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    if (users.some((u: User) => u.email === email)) {
      toast({
        title: "Registration failed",
        description: "Email already exists",
        variant: "destructive",
      });
      return false;
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      username: email.split('@')[0],
      avatar: `https://avatar.vercel.sh/${email}`,
      createdAt: new Date().toISOString(),
      theme: {
        gradient: 'none',
        pattern: 'none',
        showStats: true,
        showBadges: true
      }
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(userWithoutPassword));

    toast({
      title: "Welcome!",
      description: "Your account has been created successfully.",
    });
    return true;
  };

  const resetPassword = async (email: string) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find((u: User) => u.email === email);
    
    if (!user) {
      toast({
        title: "Reset failed",
        description: "No account found with this email",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Check your email",
      description: "Password reset instructions have been sent to your email.",
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      resetPassword,
      updateProfile,
      updateTheme,
      updateAvatar,
      removeAvatar,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}