import type { Metadata } from 'next';
import { getUserForCertificate } from '@/lib/certificate';
import { CertificatePage } from '@/components/certificate/CertificatePage';
import { notFound } from 'next/navigation';

export async function generateMetadata(
  { params }: { params: Promise<{ userId: string }> }
): Promise<Metadata> {
  const { userId } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  return {
    title: 'Completé el tutorial de Claude Code — ZalesMachine',
    description: 'Aprendí a construir un agente de investigación de startups con Claude Code. 7 niveles, ~1 hora.',
    openGraph: {
      title: 'Completé el tutorial de Claude Code — ZalesMachine',
      description: 'Aprendí a construir un agente de investigación de startups con Claude Code. 7 niveles, ~1 hora.',
      url: `${baseUrl}/certificate/${userId}`,
      images: [
        {
          url: `${baseUrl}/api/certificate/${userId}`,
          width: 1200,
          height: 630,
          alt: 'Certificado de Claude Code Mastery',
        },
      ],
    },
  };
}

export default async function CertificateRoute(
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const userData = await getUserForCertificate(userId);

  if (!userData) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const certificateUrl = `${baseUrl}/certificate/${userId}`;
  const tutorialUrl = `${baseUrl}/`;

  const postText = `Completé el tutorial Claude Code Mastery de ZalesMachine y construí un agente de investigación de startups desde cero. Si querés aprender cómo usar Claude Code para proyectos reales, te dejo el link: ${tutorialUrl} — ${userData.name}`;

  return (
    <CertificatePage
      userId={userId}
      userName={userData.name}
      certificateUrl={certificateUrl}
      postText={postText}
      tutorialUrl={tutorialUrl}
    />
  );
}
