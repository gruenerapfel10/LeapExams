import { auth } from '@/app/auth/auth';
import { redirect } from 'next/navigation';

export default async function ExamsPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Exams</h1>
      <p>Here you can view and manage your exams.</p>
    </div>
  );
} 