import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Shield, Ban, CheckCircle, History } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserDetailsDialog } from './UserDetailsDialog';
import { format } from 'date-fns';
import { userOperations } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

interface UserListProps {
  search: string;
  role: string;
  status: string;
}

export function UserList({ search, role, status }: UserListProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await userOperations.getAll();
      setUsers(allUsers);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search, role, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      search === '' ||
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.username?.toLowerCase().includes(search.toLowerCase());

    const matchesRole = role === 'all' || user.role === role;
    const matchesStatus = status === 'all' || user.status === status;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await userOperations.updateRole(userId, newRole);
      toast({
        title: "Success",
        description: "User role updated successfully"
      });
      loadUsers(); // Reload users to reflect changes
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      await userOperations.banUser(userId, "Violated community guidelines");
      toast({
        title: "Success",
        description: "User has been banned"
      });
      loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to ban user",
        variant: "destructive"
      });
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      await userOperations.verifyUser(userId);
      toast({
        title: "Success",
        description: "User has been verified"
      });
      loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify user",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name?.[0] || user.username?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name || user.username}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role || 'user'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      user.status === 'active' ? 'success' :
                      user.status === 'banned' ? 'destructive' :
                      'secondary'
                    }
                  >
                    {user.status || 'active'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.isVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleVerifyUser(user.id)}
                    >
                      Verify
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(user.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {user.lastActive ? 
                    format(new Date(user.lastActive), 'MMM d, yyyy') :
                    'Never'
                  }
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedUser(user.id)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}>
                        <Shield className="h-4 w-4 mr-2" />
                        {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <History className="h-4 w-4 mr-2" />
                        View Activity
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleBanUser(user.id)}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Ban User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <UserDetailsDialog
          userId={selectedUser}
          open={!!selectedUser}
          onOpenChange={() => setSelectedUser(null)}
          onUserUpdate={loadUsers}
        />
      )}
    </>
  );
}