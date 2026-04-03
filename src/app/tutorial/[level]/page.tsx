import { notFound } from 'next/navigation';
import { LevelPage } from '@/components/tutorial/LevelPage';

interface TutorialLevelPageProps {
  params: Promise<{ level: string }>;
}

export default async function TutorialLevelPage({ params }: TutorialLevelPageProps) {
  const { level } = await params;
  const levelNum = parseInt(level, 10);

  if (isNaN(levelNum) || levelNum < 0 || levelNum > 6) {
    notFound();
  }

  return <LevelPage level={levelNum} />;
}
