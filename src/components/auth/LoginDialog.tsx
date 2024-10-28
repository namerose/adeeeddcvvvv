import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn } from 'lucide-react';
import { RegisterDialog } from './RegisterDialog';
import { ResetPasswordDialog } from './ResetPasswordDialog';

export function LoginDialog() {
  const [open, setOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      setOpen(false);
      setEmail('');
      setPassword('');
    }
  };

  if (showRegister) {
    return (
      <RegisterDialog
        open={true}
        onOpenChange={(open) => {
          setShowRegister(false);
          setOpen(open);
        }}
      />
    );
  }

  if (showReset) {
    return (
      <ResetPasswordDialog
        open={true}
        onOpenChange={(open) => {
          setShowReset(false);
          setOpen(open);
        }}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Sign in to submit and interact with projects.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
          
          <div className="flex items-center justify-between text-sm">
            <Button
              variant="link"
              className="px-0"
              onClick={() => setShowRegister(true)}
            >
              Create account
            </Button>
            <Button
              variant="link"
              className="px-0"
              onClick={() => setShowReset(true)}
            >
              Forgot password?
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}