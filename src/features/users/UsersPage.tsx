import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { TableSkeleton } from '@/components/shared/SkeletonLoader';
import { useUsers, useUpdateUserRole } from '@/hooks/useDataHooks';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Users as UsersIcon,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  Mail,
  Calendar,
} from 'lucide-react';
import { formatDate, formatDateTime, getInitials } from '@/utils/helpers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const updateRole = useUpdateUserRole();
  const { user: currentUser } = useAuthStore();
  const { toast } = useToast();

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<'admin' | 'staff'>('staff');

  const handleRoleChange = async () => {
    if (!selectedUserId) return;

    try {
      await updateRole.mutateAsync({ id: selectedUserId, role: newRole });
      toast({
        title: 'Role updated',
        description: `User role has been changed to ${newRole}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user role.',
        variant: 'destructive',
      });
    } finally {
      setRoleDialogOpen(false);
      setSelectedUserId(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant="default" className="gap-1">
            <ShieldCheck className="h-3 w-3" />
            Admin
          </Badge>
        );
      case 'staff':
        return (
          <Badge variant="secondary" className="gap-1">
            <Shield className="h-3 w-3" />
            Staff
          </Badge>
        );
      default:
        return <Badge variant="ghost">{role}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Users"
        description="Manage team members and permissions"
        actions={
          <Button onClick={() => toast({ title: 'Coming soon', description: 'User invitation feature will be available soon.' })}>
            <Plus className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        }
      />

      {/* Permissions Matrix */}
      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <h3 className="font-semibold text-foreground mb-4">Role Permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-medium text-muted-foreground">Permission</th>
                <th className="text-center py-2 font-medium text-muted-foreground">Admin</th>
                <th className="text-center py-2 font-medium text-muted-foreground">Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-2 text-foreground">View Dashboard</td>
                <td className="text-center text-success">✓</td>
                <td className="text-center text-success">✓</td>
              </tr>
              <tr>
                <td className="py-2 text-foreground">Manage Products</td>
                <td className="text-center text-success">✓</td>
                <td className="text-center text-success">✓</td>
              </tr>
              <tr>
                <td className="py-2 text-foreground">Manage Knowledge Base</td>
                <td className="text-center text-success">✓</td>
                <td className="text-center text-success">✓</td>
              </tr>
              <tr>
                <td className="py-2 text-foreground">View Conversations</td>
                <td className="text-center text-success">✓</td>
                <td className="text-center text-success">✓</td>
              </tr>
              <tr>
                <td className="py-2 text-foreground">Configure AI Settings</td>
                <td className="text-center text-success">✓</td>
                <td className="text-center text-muted-foreground">–</td>
              </tr>
              <tr>
                <td className="py-2 text-foreground">Manage Users</td>
                <td className="text-center text-success">✓</td>
                <td className="text-center text-muted-foreground">–</td>
              </tr>
              <tr>
                <td className="py-2 text-foreground">Export Reports</td>
                <td className="text-center text-success">✓</td>
                <td className="text-center text-muted-foreground">–</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={3} />
          </div>
        ) : users?.length === 0 ? (
          <EmptyState
            icon={<UsersIcon className="h-8 w-8 text-muted-foreground" />}
            title="No users found"
            description="Invite team members to get started."
            action={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Invite User
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    User
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Role
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Joined
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Last Active
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users?.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(user.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : 'Never'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            disabled={user.id === currentUser?.id}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border border-border shadow-lg z-50">
                          <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setNewRole('admin');
                              setRoleDialogOpen(true);
                            }}
                            disabled={user.role === 'admin'}
                          >
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setNewRole('staff');
                              setRoleDialogOpen(true);
                            }}
                            disabled={user.role === 'staff'}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Make Staff
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Change Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to change this user's role to {newRole}?
              {newRole === 'admin' && ' This will grant them full administrative access.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
