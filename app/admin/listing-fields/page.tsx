'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ListingFieldsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/listing-fields/custom-fields');
  }, [router]);

  return null;
}
