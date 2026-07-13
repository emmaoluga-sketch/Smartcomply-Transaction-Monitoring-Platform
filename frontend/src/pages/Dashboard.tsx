import { useEffect, useState } from 'react';
import { getTransactions, Transaction } from '../api/transactions';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [recentTxns, setRecentTxns] = useState<Transaction[]>([]);
  useEffect(() => {
    getTransactions({ ordering: '-created_at', page: 1 }).then(res => setRecentTxns(res.data.results.slice(0, 5)));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold">Recent Transactions</h3>
          <ul>
            {recentTxns.map(tx => (
              <li key={tx.id} className="text-sm">{tx.reference} - ${tx.amount}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <Link to="/transactions" className="text-indigo-600 hover:underline">View All Transactions</Link>
        </div>
      </div>
    </div>
  );
}