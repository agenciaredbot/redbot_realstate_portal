'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { Profile, Notification } from '@/types/admin';
import {
  Bell,
  Menu,
  X,
  Search,
  ChevronRight,
  Check,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  profile: Profile | null;
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

// Breadcrumb mapping
const breadcrumbLabels: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  propiedades: 'Propiedades',
  pendientes: 'Pendientes',
  nueva: 'Nueva',
  agentes: 'Agentes',
  usuarios: 'Usuarios',
  leads: 'Leads',
  blog: 'Blog',
  proyectos: 'Proyectos',
  testimonios: 'Testimonios',
  configuracion: 'Configuración',
  perfil: 'Mi Perfil',
  'mis-propiedades': 'Mis Propiedades',
};

// Notification icon and color mapping
const notificationStyles: Record<string, { color: string; icon: string }> = {
  new_lead: { color: 'bg-blue-500', icon: '📩' },
  property_submitted: { color: 'bg-yellow-500', icon: '🏠' },
  property_approved: { color: 'bg-green-500', icon: '✅' },
  property_rejected: { color: 'bg-red-500', icon: '❌' },
  property_assigned: { color: 'bg-purple-500', icon: '📋' },
  agent_assigned: { color: 'bg-indigo-500', icon: '👤' },
  system: { color: 'bg-gray-500', icon: '⚙️' },
};

export function Header({
  profile,
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onToggleMobileMenu,
  isMobileMenuOpen,
}: HeaderProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = breadcrumbLabels[segment] || segment;
    return { href, label };
  });

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left side - Mobile menu button + Breadcrumbs */}
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-gray-900">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right side - Search + Notifications + Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search (hidden on mobile) */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>

          {/* View site link */}
          <Link
            href="/"
            target="_blank"
            className="hidden md:flex items-center gap-1 text-sm text-gray-600 hover:text-luxus-gold"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Ver sitio</span>
          </Link>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notificaciones</span>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-xs text-luxus-gold hover:underline"
                  >
                    Marcar todas como leídas
                  </button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {notifications.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No tienes notificaciones</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {notifications.slice(0, 10).map((notification) => {
                    const style = notificationStyles[notification.type] || {
                      color: 'bg-gray-500',
                      icon: '📌',
                    };

                    return (
                      <DropdownMenuItem
                        key={notification.id}
                        className={cn(
                          'flex items-start gap-3 p-3 cursor-pointer',
                          !notification.is_read && 'bg-blue-50'
                        )}
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        <span
                          className={cn(
                            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm',
                            style.color
                          )}
                        >
                          {style.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              'text-sm',
                              !notification.is_read && 'font-medium'
                            )}
                          >
                            {notification.title}
                          </p>
                          {notification.message && (
                            <p className="text-xs text-gray-500 truncate">
                              {notification.message}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {formatRelativeTime(notification.created_at)}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              )}

              {notifications.length > 10 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin/notificaciones"
                      className="w-full text-center text-sm text-luxus-gold"
                    >
                      Ver todas las notificaciones
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 h-auto py-1"
              >
                <div className="w-8 h-8 rounded-full bg-luxus-gold/10 flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || 'Avatar'}
                      className="w-8 h-8 object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-luxus-gold">
                      {profile?.full_name?.charAt(0) ||
                        profile?.email?.charAt(0) ||
                        'U'}
                    </span>
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {profile?.full_name || profile?.email}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{profile?.full_name || 'Usuario'}</span>
                  <span className="text-xs font-normal text-gray-500">
                    {profile?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/perfil">Mi Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/" target="_blank">
                  Ver sitio
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
