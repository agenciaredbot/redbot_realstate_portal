'use client';

import Link from 'next/link';
import type { UserDashboardStats } from '@/types/admin';
import {
  Building2,
  Clock,
  XCircle,
  Eye,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UserDashboardProps {
  stats: UserDashboardStats;
}

export function UserDashboard({ stats }: UserDashboardProps) {
  const statCards = [
    {
      title: 'Propiedades Publicadas',
      value: stats.publishedProperties,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/admin/propiedades',
    },
    {
      title: 'Pendientes de Aprobación',
      value: stats.pendingProperties,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      href: '/admin/propiedades',
      highlight: stats.pendingProperties > 0,
    },
    {
      title: 'Rechazadas',
      value: stats.rejectedProperties,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      href: '/admin/propiedades',
    },
    {
      title: 'Vistas Totales',
      value: stats.totalViews,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Dashboard</h1>
        <p className="text-gray-500">
          Gestiona tus propiedades y consulta su estado
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        {/* Create Property CTA */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Publicar Propiedad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Publica tu propiedad en venta o arriendo. Un administrador la
              revisará antes de publicarla.
            </p>
            <Button asChild className="w-full">
              <Link href="/admin/propiedades/nueva">
                Crear nueva propiedad
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pending Properties Alert */}
        {stats.pendingProperties > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-yellow-800">
                <Clock className="h-5 w-5" />
                Propiedades en Revisión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-700 mb-4">
                Tienes {stats.pendingProperties} propiedad(es) esperando
                aprobación del administrador.
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full border-yellow-400 text-yellow-800 hover:bg-yellow-100"
              >
                <Link href="/admin/propiedades">
                  Ver mis propiedades
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Rejected Properties Alert */}
        {stats.rejectedProperties > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                <XCircle className="h-5 w-5" />
                Propiedades Rechazadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-700 mb-4">
                Tienes {stats.rejectedProperties} propiedad(es) que no fueron
                aprobadas. Revisa los motivos y puedes volver a enviarlas.
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full border-red-400 text-red-800 hover:bg-red-100"
              >
                <Link href="/admin/propiedades">
                  Ver propiedades rechazadas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* My Properties */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Mis Propiedades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Publicadas</span>
                <span className="font-semibold text-green-600">
                  {stats.publishedProperties}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">En revisión</span>
                <span className="font-semibold text-yellow-600">
                  {stats.pendingProperties}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rechazadas</span>
                <span className="font-semibold text-red-600">
                  {stats.rejectedProperties}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-gray-600">Vistas totales</span>
                <span className="font-semibold">{stats.totalViews}</span>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/admin/propiedades">
                Ver todas mis propiedades
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Profile */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Mi Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Mantén actualizada tu información de contacto para que los
              interesados puedan comunicarse contigo.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/perfil">
                Editar mi perfil
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
