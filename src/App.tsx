import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ProjectProvider, useProjects } from '@/context/ProjectContext';
import { AuthProvider } from '@/context/AuthContext';
import { DiscussionProvider } from '@/context/DiscussionContext';
import { EventProvider } from '@/context/EventContext'; 
import { BadgeProvider } from '@/context/BadgeContext';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import { TodayProjects } from '@/components/TodayProjects';
import { UpcomingProjects } from '@/components/UpcomingProjects';
import { PopularProjects } from '@/components/PopularProjects';
import { ProjectDetail } from '@/components/ProjectDetail';
import { Discussions } from '@/components/Discussions';
import { ThreadDetail } from '@/components/discussions/ThreadDetail';
import { Events } from '@/components/Events';
import { BadgesPage } from '@/components/badges/BadgesPage';
import { ProfilePage } from '@/components/profile/ProfilePage';
import { PublicProfile } from '@/components/profile/PublicProfile';
import { MyProjects } from '@/components/profile/MyProjects';
import { Sidebar } from '@/components/Sidebar';
import { MarketplacePage } from '@/components/marketplace/MarketplacePage';
import { JobBoard } from '@/components/marketplace/JobBoard';
import { EmployerGuidelines } from '@/components/employer/EmployerGuidelines';
import { LaunchGuidelines } from '@/components/launch/LaunchGuidelines';
import { CommunityGuidelines } from '@/components/community/CommunityGuidelines';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { UserManagement } from '@/components/admin/users/UserManagement';

function MainContent() {
  const [currentView, setCurrentView] = useState('today');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<string | null>(null);
  const [profileUsername, setProfileUsername] = useState<string | null>(null);
  const { projects } = useProjects();

  // Initial URL handling
  const handleInitialHash = useCallback(() => {
    const hash = window.location.hash.slice(1) || '/today';
    const [path, param] = hash.replace('/', '').split('/');
    
    if (path.startsWith('@')) {
      setCurrentView('profile');
      setSelectedProjectId(null);
      setSelectedDiscussionId(null);
      setProfileUsername(path.slice(1));
    } else {
      setCurrentView(path);
      
      if (path === 'project') {
        setSelectedProjectId(param || null);
        setSelectedDiscussionId(null);
        setProfileUsername(null);
      } else if (path === 'discussions' && param) {
        setSelectedDiscussionId(param);
        setSelectedProjectId(null);
        setProfileUsername(null);
      } else {
        setSelectedProjectId(null);
        setSelectedDiscussionId(null);
        setProfileUsername(null);
      }
    }
  }, []);

  useEffect(() => {
    handleInitialHash();

    // Hash change listener
    const handleHashChange = () => {
      handleInitialHash();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []); // Empty dependency array since we don't need any dependencies

  const selectedProject = selectedProjectId 
    ? projects.find(p => p.id === selectedProjectId)
    : null;

  // Check if we're in admin routes
  if (currentView.startsWith('admin')) {
    return (
      <AdminLayout>
        {currentView === 'admin' && <AdminDashboard />}
        {currentView === 'admin/users' && <UserManagement />}
      </AdminLayout>
    );
  }

  return (
    <Layout>
      <div className="py-8">
        <div className="flex gap-8">
          <div className={selectedProject ? "w-full" : "flex-1"}>
            {selectedProject ? (
              <ProjectDetail project={selectedProject} />
            ) : selectedDiscussionId ? (
              <ThreadDetail threadId={selectedDiscussionId} />
            ) : profileUsername ? (
              <PublicProfile username={profileUsername} />
            ) : (
              <>
                {currentView === 'today' && <TodayProjects />}
                {currentView === 'upcoming' && <UpcomingProjects />}
                {currentView === 'popular' && <PopularProjects />}
                {currentView === 'discussions' && <Discussions />}
                {currentView === 'events' && <Events />}
                {currentView === 'badges' && <BadgesPage />}
                {currentView === 'profile' && <ProfilePage />}
                {currentView === 'my-projects' && <MyProjects />}
                {currentView === 'marketplace' && <MarketplacePage />}
                {currentView === 'jobs' && <JobBoard />}
                {currentView === 'employer-guidelines' && <EmployerGuidelines />}
                {currentView === 'launch-guidelines' && <LaunchGuidelines />}
                {currentView === 'community-guidelines' && <CommunityGuidelines />}
              </>
            )}
          </div>
          {!selectedProject && !profileUsername && 
           !['discussions', 'events', 'badges', 'profile', 'my-projects', 'marketplace', 'jobs', 'employer-guidelines', 'launch-guidelines', 'community-guidelines'].includes(currentView) && 
           <Sidebar />}
        </div>
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <ProjectProvider>
            <DiscussionProvider>
              <EventProvider>
                <BadgeProvider>
                  <MainContent />
                  <Toaster />
                </BadgeProvider>
              </EventProvider>
            </DiscussionProvider>
          </ProjectProvider>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}