'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EcommercePage() {
  const router = useRouter();
  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (!auth) router.push('/admin/login');
    else router.replace('/admin/ecommerce/orders');
  }, [router]);
  return null;
}
