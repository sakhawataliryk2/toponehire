'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';

type StripeConfig = { publishableKey?: string; secretKey?: string; webhookSecret?: string };

export default function EditPaymentMethodPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [stripeConfig, setStripeConfig] = useState<StripeConfig>({ publishableKey: '', secretKey: '', webhookSecret: '' });

  const isStripe = name.toLowerCase() === 'stripe';

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/payment-methods/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const m = data.paymentMethod;
        if (m) {
          setName(m.name);
          setIsActive(m.isActive !== false);
          if (m.config) {
            try {
              const parsed = JSON.parse(m.config) as StripeConfig;
              setStripeConfig({
                publishableKey: parsed.publishableKey ?? '',
                secretKey: parsed.secretKey ?? '',
                webhookSecret: parsed.webhookSecret ?? '',
              });
            } catch {
              setStripeConfig({ publishableKey: '', secretKey: '', webhookSecret: '' });
            }
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const config =
        isStripe &&
        (stripeConfig.publishableKey || stripeConfig.secretKey || stripeConfig.webhookSecret)
          ? JSON.stringify(stripeConfig)
          : undefined;
      const res = await fetch(`/api/admin/payment-methods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          isActive,
          ...(config !== undefined && { config }),
        }),
      });
      if (res.ok) router.push('/admin/ecommerce/payment-methods');
      else alert((await res.json()).error || 'Failed to update');
    } catch (e) {
      alert('Error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Payment Method</h1>
          <Link href="/admin/ecommerce/payment-methods" className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Back</Link>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 max-w-xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
          </div>

          {isStripe && (
            <div className="space-y-4 rounded-lg border border-gray-200 p-4 bg-gray-50">
              <h3 className="font-medium text-gray-900">Stripe API keys</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publishable key</label>
                <input
                  type="text"
                  placeholder="pk_live_..."
                  value={stripeConfig.publishableKey}
                  onChange={(e) => setStripeConfig((c) => ({ ...c, publishableKey: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secret key</label>
                <input
                  type="password"
                  placeholder="sk_live_..."
                  value={stripeConfig.secretKey}
                  onChange={(e) => setStripeConfig((c) => ({ ...c, secretKey: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  autoComplete="off"
                />
                <p className="text-xs text-gray-500 mt-1">Keep this private. Leave blank to keep existing value.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Webhook secret (optional)</label>
                <input
                  type="password"
                  placeholder="whsec_..."
                  value={stripeConfig.webhookSecret}
                  onChange={(e) => setStripeConfig((c) => ({ ...c, webhookSecret: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  autoComplete="off"
                />
              </div>
            </div>
          )}

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Active
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Save Changes</button>
            <Link href="/admin/ecommerce/payment-methods" className="px-6 py-2 bg-gray-200 rounded-lg">Cancel</Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
