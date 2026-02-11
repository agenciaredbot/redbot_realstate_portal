'use client';

import Link from 'next/link';
import type { AgentDashboardStats } from '@/types/admin';
import {
  Building2,
  MessageSquare,
  Star,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AgentDashboardProps {
  stats: AgentDashboardStats;
}

export function AgentDashboard({ stats }: AgentDashboardProps) {
  const statCards = [
    {
      title: 'Propiedades Asignadas',
      value: stats.assignedProperties,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/admin/propiedades',
    },
    {
      title: 'Leads Totales',
      value: stats.totalLeads,
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/admin/leads',
    },
    {
      title: 'Leads Nuevos',
      value: stats.newLeads,
      icon: MessageSquare,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      href: '/admin/leads',
      highlight: stats.newLeads > 0,
    },
    {
      title: 'Leads Convertidos',
      value: stats.convertedLeads,
      icon: UserCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Rating Promedio',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Dashboard</h1>
        <p className="text-gray-500">
          Resumen de tu actividad como agente
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat) => {
          const content = (
            <Card
              className={cn(
                'hover:shadow-md transition-shadow',
                stat.href && 'cursor-pointer',
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
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          );

          return stat.href ? (
            <Link key={stat.title} href={stat.href}>
              {content}
            </Link>
          ) : (
            <div key={stat.title}>{content}</div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Leads Alert */}
        {stats.newLeads > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-yellow-800">
                <MessageSquare className="h-5 w-5" />
                Leads Nuevos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-700 mb-4">
                Tienes {stats.newLeads} leads nuevos esperando atención.
              </p>
              <Button asChild variant="outline" className="w-full border-yellow-400 text-yellow-800 hover:bg-yellow-100">
                <Link href="/admin/leads">
                  Ver leads
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Properties */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Mis Propiedades</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Tienes {stats.assignedProperties} propiedades asignadas.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/propiedades">
                Ver propiedades
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Mi Rendimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Leads totales</span>
                <span className="font-semibold">{stats.totalLeads}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Convertidos</span>
                <span className="font-semibold text-green-600">
                  {stats.convertedLeads}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-gray-600">Tasa de conversión</span>
                <span className="font-semibold">
                  {stats.totalLeads > 0
                    ? Math.round((stats.convertedLeads / stats.totalLeads) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Mi Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <span className="text-lg font-semibold">
                {stats.averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">rating promedio</span>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/perfil">
                Editar perfil
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
