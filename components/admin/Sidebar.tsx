'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Profile } from '@/types/admin';
import { USER_ROLES, ROLE_LABELS } from '@/types/admin';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCircle,
  MessageSquare,
  FileText,
  FolderKanban,
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  LogOut,
  Bell,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: number[]; // Which roles can see this
  badge?: number;
}

interface SidebarProps {
  profile: Profile | null;
  pendingCount?: number;
  onSignOut: () => void;
}

export function Sidebar({ profile, pendingCount = 0, onSignOut }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Get role as number, default to USER (3)
  const role: number = profile?.role ?? USER_ROLES.USER;

  // Check if user is Super Admin (role = 0)
  const isSuperAdmin = role === 0;

  // Navigation items based on role
  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: [0, 1, 2, 3], // Added 0 for Super Admin
    },
    {
      label: 'Propiedades',
      href: '/admin/propiedades',
      icon: <Building2 className="h-5 w-5" />,
      roles: [0, 1, 2], // Added 0 for Super Admin
    },
    {
      label: 'Pendientes',
      href: '/admin/propiedades/pendientes',
      icon: <Clock className="h-5 w-5" />,
      roles: [0, 1], // Added 0 for Super Admin
      badge: pendingCount,
    },
    {
      label: 'Mis Propiedades',
      href: '/admin/propiedades/mis-propiedades',
      icon: <Home className="h-5 w-5" />,
      roles: [3],
    },
    {
      label: 'Nueva Propiedad',
      href: '/admin/propiedades/nueva',
      icon: <Building2 className="h-5 w-5" />,
      roles: [3],
    },
    {
      label: 'Agentes',
      href: '/admin/agentes',
      icon: <Users className="h-5 w-5" />,
      roles: [0, 1], // Added 0 for Super Admin
    },
    {
      label: 'Usuarios',
      href: '/admin/usuarios',
      icon: <UserCircle className="h-5 w-5" />,
      roles: [0, 1], // Added 0 for Super Admin
    },
    {
      label: 'Leads',
      href: '/admin/leads',
      icon: <MessageSquare className="h-5 w-5" />,
      roles: [0, 1, 2], // Added 0 for Super Admin
    },
    {
      label: 'Blog',
      href: '/admin/blog',
      icon: <FileText className="h-5 w-5" />,
      roles: [0, 1], // Added 0 for Super Admin
    },
    {
      label: 'Proyectos',
      href: '/admin/proyectos',
      icon: <FolderKanban className="h-5 w-5" />,
      roles: [0, 1], // Added 0 for Super Admin
    },
    {
      label: 'Testimonios',
      href: '/admin/testimonios',
      icon: <Star className="h-5 w-5" />,
      roles: [0, 1], // Added 0 for Super Admin
    },
    {
      label: 'Configuración',
      href: '/admin/configuracion',
      icon: <Settings className="h-5 w-5" />,
      roles: [0, 1], // Added 0 for Super Admin
    },
  ];

  // Filter items based on role
  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!isCollapsed && (
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-luxus-gold" />
              <span className="text-lg font-bold text-gray-900">
                Redbot<span className="text-luxus-gold">Admin</span>
              </span>
            </Link>
          )}
          {isCollapsed && (
            <Building2 className="h-8 w-8 text-luxus-gold mx-auto" />
          )}
        </div>

        {/* User info */}
        {!isCollapsed && profile && (
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-luxus-gold/10 flex items-center justify-center">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'Avatar'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="h-6 w-6 text-luxus-gold" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile.full_name || profile.email}
                </p>
                <p className="text-xs text-gray-500">
                  {ROLE_LABELS[role as keyof typeof ROLE_LABELS]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {visibleItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin/dashboard' &&
                  pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                      isActive
                        ? 'bg-luxus-gold/10 text-luxus-gold'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {item.icon}
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && item.badge > 0 && (
                          <Badge
                            variant="destructive"
                            className="h-5 min-w-[20px] flex items-center justify-center text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                    {isCollapsed && item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-2">
          {/* Super Admin link - only for role 0 */}
          {isSuperAdmin && (
            <Link
              href="/super-admin/dashboard"
              className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              title={isCollapsed ? 'Super Admin' : undefined}
            >
              <Shield className="h-5 w-5 text-red-400" />
              {!isCollapsed && <span className="font-medium">Super Admin</span>}
            </Link>
          )}

          {/* Profile link */}
          <Link
            href="/admin/perfil"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors',
              pathname === '/admin/perfil' && 'bg-luxus-gold/10 text-luxus-gold'
            )}
            title={isCollapsed ? 'Mi Perfil' : undefined}
          >
            <UserCircle className="h-5 w-5" />
            {!isCollapsed && <span>Mi Perfil</span>}
          </Link>

          {/* Sign out */}
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            title={isCollapsed ? 'Cerrar Sesión' : undefined}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 mt-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm">Colapsar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
