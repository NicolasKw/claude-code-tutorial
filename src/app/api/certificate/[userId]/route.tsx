import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getUserForCertificate } from '@/lib/certificate';
import { TOTAL_LEVELS } from '@/lib/types/tutorial';
import type { TutorialProgress } from '@/lib/types/tutorial';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  const userData = await getUserForCertificate(userId);
  if (!userData) return new Response('Not found', { status: 404 });

  const progressData = userData.progressData as TutorialProgress | null;
  const completedLevels = progressData?.completedLevels?.length ?? 0;

  // Use completedAt from JSONB if available, otherwise fall back to updatedAt
  const completionDate = progressData?.completedAt
    ? new Date(progressData.completedAt)
    : userData.progressUpdatedAt ?? new Date();

  const formattedDate = completionDate.toLocaleDateString('es-AR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  // Load Inter fonts as ArrayBuffer
  const fontBold = await readFile(join(process.cwd(), 'public/fonts/Inter-Bold.ttf'));
  const fontRegular = await readFile(join(process.cwd(), 'public/fonts/Inter-Regular.ttf'));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#171717',
          padding: '60px',
          fontFamily: 'Inter',
        }}
      >
        {/* ZalesMachine wordmark top */}
        <div style={{ fontSize: 28, fontWeight: 700, color: '#D9ADFF', marginBottom: '8px' }}>
          ZalesMachine
        </div>

        {/* Label */}
        <div style={{ fontSize: 20, fontWeight: 400, color: '#A3A3A3', marginBottom: '32px' }}>
          Certificado de Finalización
        </div>

        {/* User name */}
        <div style={{ fontSize: 48, fontWeight: 700, color: '#FFFFFF', marginBottom: '24px' }}>
          {userData.name}
        </div>

        {/* Course name */}
        <div style={{ fontSize: 24, fontWeight: 400, color: '#E9FFB9', marginBottom: '8px' }}>
          Claude Code Mastery
        </div>

        {/* Levels completed */}
        <div style={{ fontSize: 18, fontWeight: 400, color: '#70B5FF', marginBottom: '24px' }}>
          {completedLevels} de {TOTAL_LEVELS} Niveles completados
        </div>

        {/* Date */}
        <div style={{ fontSize: 16, fontWeight: 400, color: '#A3A3A3' }}>
          {formattedDate}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: fontBold, weight: 700, style: 'normal' },
        { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
      ],
    }
  );
}
