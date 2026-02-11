'use client';

import Link from 'next/link';
import type { AdminDashboardStats } from '@/types/admin';
import {
  Building2,
  Users,
  UserCircle,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminDashboardProps {
  stats: AdminDashboardStats;
}

export function AdminDashboard({ stats }: AdminDashboardProps) {
  const statCards = [
    {
      title: 'Propiedades Activas',
      value: stats.activeProperties,
      total: stats.totalProperties,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/admin/propiedades',
    },
    {
      title: 'Pendientes de Aprobación',
      value: stats.pendingProperties,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      href: '/admin/propiedades/pendientes',
      highlight: stats.pendingProperties > 0,
    },
    {
      title: 'Agentes Activos',
      value: stats.totalAgents,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/admin/agentes',
    },
    {
      title: 'Usuarios Registrados',
      value: stats.totalUsers,
      icon: UserCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/admin/usuarios',
    },
    {
      title: 'Leads Este Mes',
      value: stats.leadsThisMonth,
      change: stats.leadsChange,
      icon: MessageSquare,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      href: '/admin/leads',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">
          Bienvenido al panel de administración
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card
              className={cn(
                'hover:shadow-md transition-shadow cursor-pointer',
                stat.highlight && 'ring-2 ring-yellow-400'
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      stat.bgColor
                    )}
                  >
                    <stat.icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                  {stat.change !== undefined && (
                    <div
                      className={cn(
                        'flex items-center gap-1 text-sm',
                        stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {stat.change >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span>{Math.abs(stat.change)}%</span>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                    {stat.total && (
                      <span className="text-sm font-normal text-gray-500">
                        {' '}
                        / {stat.total}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pending Properties */}
        {stats.pendingProperties > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-yellow-800">
                <Clock className="h-5 w-5" />
                Propiedades Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-700 mb-4">
                Tienes {stats.pendingProperties} propiedades esperando aprobación.
              </p>
              <Button asChild variant="outline" className="w-full border-yellow-400 text-yellow-800 hover:bg-yellow-100">
                <Link href="/admin/propiedades/pendientes">
                  Revisar ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/propiedades/nueva">
                <Building2 className="mr-2 h-4 w-4" />
                Crear Propiedad
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/blog/nuevo">
                <Building2 className="mr-2 h-4 w-4" />
                Nuevo Post de Blog
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/agentes">
                <Users className="mr-2 h-4 w-4" />
                Gestionar Agentes
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Leads Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resumen de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Este mes</span>
                <span className="font-semibold">{stats.leadsThisMonth}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Mes anterior</span>
                <span className="font-semibold">{stats.leadsLastMonth}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-gray-600">Cambio</span>
                <span
                  className={cn(
                    'font-semibold flex items-center gap-1',
                    stats.leadsChange >= 0 ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {stats.leadsChange >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {stats.leadsChange >= 0 ? '+' : ''}
                  {stats.leadsChange}%
                </span>
              </div>
            </div>
            <Button asChild variant="link" className="w-full mt-4 p-0">
              <Link href="/admin/leads">
                Ver todos los leads
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
