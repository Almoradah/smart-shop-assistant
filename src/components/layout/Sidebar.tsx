import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/store/sidebarStore';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  Smartphone,
  BookOpen,
  MessageSquare,
  BarChart3,
  Settings,
  Users,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  Cpu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Smartphone },
  { name: 'Knowledge Base', href: '/knowledge', icon: BookOpen },
  { name: 'Conversations', href: '/conversations', icon: MessageSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'AI Settings', href: '/ai-settings', icon: Settings },
  { name: 'Users', href: '/users', icon: Users },
];

export function Sidebar() {
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
        isCollapsed ? 'w-0 lg:w-16 overflow-hidden' : 'w-64'
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Cpu className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">RAG Admin</span>
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className={cn('lg:flex', isCollapsed && 'mx-auto')}
          >
            {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5 lg:hidden" />}
            {!isCollapsed && <Menu className="h-5 w-5 hidden lg:block" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'nav-link',
                  isActive && 'active',
                  isCollapsed && 'justify-center px-2'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-sidebar-border p-3 space-y-2">
          <Button
            variant="ghost"
            size={isCollapsed ? 'icon' : 'default'}
            onClick={toggleTheme}
            className={cn('w-full', !isCollapsed && 'justify-start')}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            {!isCollapsed && <span className="ml-2">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </Button>

          {user && !isCollapsed && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.role}</p>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size={isCollapsed ? 'icon' : 'default'}
            onClick={logout}
            className={cn('w-full text-destructive hover:text-destructive hover:bg-destructive/10', !isCollapsed && 'justify-start')}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
