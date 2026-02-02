import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

interface Withdrawal {
  id: string;
  driver_id: string;
  amount: number;
  net_amount: number;
  withdrawal_method: string;
  mobile_number: string;
  status: string;
  requested_at: string;
  completed_at?: string;
  error_message?: string;
}

const WithdrawalsPanel: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the correct method from apiClient
      const res = await apiClient.getWithdrawals();
      setWithdrawals(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch withdrawals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Driver Withdrawal Requests</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2">Driver ID</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Method</th>
            <th className="px-4 py-2">Mobile</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Requested At</th>
            <th className="px-4 py-2">Completed At</th>
            <th className="px-4 py-2">Error</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((w) => (
            <tr key={w.id} className="border-t">
              <td className="px-4 py-2">{w.driver_id}</td>
              <td className="px-4 py-2">{w.amount}</td>
              <td className="px-4 py-2">{w.withdrawal_method}</td>
              <td className="px-4 py-2">{w.mobile_number}</td>
              <td className="px-4 py-2">{w.status}</td>
              <td className="px-4 py-2">{w.requested_at}</td>
              <td className="px-4 py-2">{w.completed_at || '-'}</td>
              <td className="px-4 py-2 text-xs text-red-500">{w.error_message || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WithdrawalsPanel;
