'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { useAuth } from '@/lib/hooks/useAuth';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { profile, isLoading, isAuthenticated, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Initialize notifications hook only when we have a profile
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications({
    userId: profile?.id || '',
    limit: 20,
  });

  // Fetch pending properties count for admin
  useEffect(() => {
    if (profile?.role === 1) {
      // Admin role
      fetchPendingCount();
    }
  }, [profile?.role]);

  const fetchPendingCount = async () => {
    try {
      const response = await fetch('/api/admin/pending-count');
      if (response.ok) {
        const data = await response.json();
        setPendingCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching pending count:', error);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-luxus-gold mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  // Note: Authentication is handled by middleware
  // We don't redirect here to avoid race conditions during hydration
  // If user is not authenticated, middleware will handle the redirect

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile unless menu is open */}
      <div
        className={`lg:block ${isMobileMenuOpen ? 'block' : 'hidden'}`}
      >
        <Sidebar
          profile={profile}
          pendingCount={pendingCount}
          onSignOut={handleSignOut}
        />
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="lg:ml-64 transition-all duration-300">
        <Header
          profile={profile}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
