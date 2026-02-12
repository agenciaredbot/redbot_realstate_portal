import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserProfile } from '@/lib/supabase/auth';
import { getProjects, getProjectStats, getProjectCities } from '@/lib/supabase/project-queries';
import { USER_ROLES } from '@/types/admin';
import { Plus, Building2, Eye, EyeOff, Star, Hammer, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectsTable } from './ProjectsTable';

export const dynamic = 'force-dynamic';

export default async function ProjectsAdminPage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect('/login');
  }

  // Only admins can access project management
  if (profile.role !== USER_ROLES.ADMIN) {
    redirect('/admin/dashboard');
  }

  const [projects, stats, cities] = await Promise.all([
    getProjects(),
    getProjectStats(),
    getProjectCities(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
          <p className="text-gray-500">
            Gestiona los proyectos inmobiliarios
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/proyectos/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proyecto
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Proyectos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                <p className="text-sm text-gray-500">Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
                <p className="text-sm text-gray-500">Destacados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.preventa}</p>
                <p className="text-sm text-gray-500">En Preventa</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Hammer className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.en_construccion}</p>
                <p className="text-sm text-gray-500">En Construccion</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.entrega_inmediata}</p>
                <p className="text-sm text-gray-500">Entrega Inmediata</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <EyeOff className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.vendido}</p>
                <p className="text-sm text-gray-500">Vendidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Todos los Proyectos</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectsTable
            projects={projects}
            cities={cities}
          />
        </CardContent>
      </Card>
    </div>
  );
}
