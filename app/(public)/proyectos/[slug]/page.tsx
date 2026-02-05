import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/sanity/queries';
import { adaptSanityProject } from '@/lib/sanity/adapters';
import { ProjectDetailContent } from './ProjectDetailContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawProject = await getProjectBySlug(slug);

  if (!rawProject) {
    return {
      title: 'Proyecto no encontrado | Redbot Real Estate',
    };
  }

  const project = adaptSanityProject(rawProject);

  return {
    title: `${project.title} | Redbot Real Estate`,
    description: project.description_short,
    openGraph: {
      title: project.title,
      description: project.description_short,
      images: project.images?.[0]?.url ? [project.images[0].url] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const rawProject = await getProjectBySlug(slug);

  if (!rawProject) {
    notFound();
  }

  const project = adaptSanityProject(rawProject);

  return <ProjectDetailContent project={project} />;
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((p: { slug: string }) => ({
    slug: p.slug,
  }));
}
