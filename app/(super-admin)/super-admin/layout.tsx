'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    label: 'Dashboard',
    href: '/super-admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Tenants',
    href: '/super-admin/tenants',
    icon: Building2,
  },
  {
    label: 'Facturación',
    href: '/super-admin/billing',
    icon: CreditCard,
  },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-red-500" />
            <span className="font-bold text-lg">Super Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
              <LogOut className="w-5 h-5 mr-3" />
              Volver a Admin
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b shadow-sm lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Breadcrumb */}
            <nav className="hidden md:flex items-center gap-2 text-sm">
              <Link href="/super-admin/dashboard" className="text-gray-500 hover:text-gray-700">
                Super Admin
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">
                {pathname.includes('/tenants/nuevo')
                  ? 'Nuevo Tenant'
                  : pathname.includes('/editar')
                  ? 'Editar Tenant'
                  : pathname.includes('/tenants/')
                  ? 'Detalle Tenant'
                  : pathname.includes('/tenants')
                  ? 'Tenants'
                  : pathname.includes('/billing')
                  ? 'Facturación'
                  : 'Dashboard'}
              </span>
            </nav>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-semibold">
                SA
              </div>
              <span className="hidden md:block text-sm font-medium">Super Admin</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
