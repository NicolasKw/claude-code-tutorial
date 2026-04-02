interface TutorialLevelPageProps {
  params: Promise<{ level: string }>;
}

export default async function TutorialLevelPage({ params }: TutorialLevelPageProps) {
  const { level } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold">Nivel {level}</h1>
      <p className="mt-4 text-gray-600">
        Contenido del tutorial - Nivel {level} (disponible en la siguiente fase)
      </p>
    </main>
  );
}
