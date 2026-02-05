'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function JobBoardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Job Postings by default
    router.replace('/admin/job-board/job-postings');
  }, [router]);

  return null;
}
