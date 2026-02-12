import { redirect, notFound } from 'next/navigation';
import { getUserProfile } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/server';
import { getAgents } from '@/lib/supabase/queries';
import { USER_ROLES } from '@/types/admin';
import { PropertyForm } from '../../PropertyForm';

export const dynamic = 'force-dynamic';

interface EditPropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getPropertyById(id: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching property:', error);
    return null;
  }

  return data;
}

export default async function EditPropertyPage({
  params,
}: EditPropertyPageProps) {
  const profile = await getUserProfile();
  const { id } = await params;

  if (!profile) {
    redirect('/login');
  }

  // Only admins can edit properties
  if (profile.role !== USER_ROLES.ADMIN) {
    redirect('/admin/dashboard');
  }

  const [property, agents] = await Promise.all([
    getPropertyById(id),
    getAgents(),
  ]);

  if (!property) {
    notFound();
  }

  // Map property data to form format
  const initialData = {
    id: property.id,
    title: property.title,
    description: property.description || '',
    property_type: property.property_type,
    status: property.status,
    price: property.price,
    city: property.city,
    neighborhood: property.neighborhood || '',
    address: property.address || '',
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    square_meters: property.area_m2 || 0,
    amenities: property.amenities || [],
    agent_id: property.agent_id || '',
    images: property.images || [],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar Propiedad</h1>
        <p className="text-gray-500">
          Modifica los datos de la propiedad: {property.title}
        </p>
      </div>

      {/* Form */}
      <PropertyForm
        mode="edit"
        userRole={profile.role}
        userId={profile.id}
        agents={agents}
        initialData={initialData}
      />
    </div>
  );
}
