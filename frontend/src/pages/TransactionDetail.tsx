import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTransaction, Transaction } from '../api/transactions';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function TransactionDetail() {
  const { id } = useParams<{ id: string }>();
  const [txn, setTxn] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      getTransaction(Number(id))
        .then(res => setTxn(res.data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!txn) return <div>Not found</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Transaction Detail</h2>
      <div className="bg-white p-6 shadow rounded">
        <p><strong>Reference:</strong> {txn.reference}</p>
        <p><strong>Amount:</strong> {txn.amount} {txn.currency}</p>
        <p><strong>Type:</strong> {txn.transaction_type}</p>
        <p><strong>Status:</strong> {txn.status}</p>
        <p><strong>Risk Score:</strong> {txn.risk_score}</p>
        <Link to="/transactions" className="text-indigo-600 mt-4 inline-block">Back to list</Link>
      </div>
    </div>
  );
}