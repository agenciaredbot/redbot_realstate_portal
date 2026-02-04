import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug, MOCK_PROJECTS } from '@/lib/mock-data';
import { ProjectDetailContent } from './ProjectDetailContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Proyecto no encontrado | Redbot Real Estate',
    };
  }

  return {
    title: `${project.title} | Redbot Real Estate`,
    description: project.description_short,
    openGraph: {
      title: project.title,
      description: project.description_short,
      images: project.images[0]?.url ? [project.images[0].url] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailContent project={project} />;
}

export function generateStaticParams() {
  return MOCK_PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}
