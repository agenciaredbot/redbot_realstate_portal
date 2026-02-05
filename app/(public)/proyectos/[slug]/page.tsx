import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/supabase/queries';
import { ProjectDetailContent } from './ProjectDetailContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Proyecto no encontrado | Redbot Real Estate',
    };
  }

  return {
    title: `${project.name} | Redbot Real Estate`,
    description: project.description_short,
    openGraph: {
      title: project.name,
      description: project.description_short,
      images: project.images?.[0] ? [project.images[0]] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailContent project={project} />;
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((p) => ({
    slug: p.slug,
  }));
}
