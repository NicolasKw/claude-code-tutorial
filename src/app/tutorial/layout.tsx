import { SessionGuard } from '@/components/SessionGuard';

export default function TutorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionGuard>{children}</SessionGuard>;
}
