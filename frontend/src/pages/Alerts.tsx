import { useState, useEffect } from 'react';
import { getAlerts, Alert } from '../api/alerts';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Link } from 'react-router-dom';

export default function Alerts() {
  const [data, setData] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAlerts({ page });
      setData(res.data.results);
      setTotalPages(Math.ceil(res.data.count / 20));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const columns = [
    { header: 'Rule', accessor: 'rule_name' as keyof Alert },
    { header: 'Message', accessor: 'message' },
    { header: 'Transaction', accessor: (a: Alert) => <Link to={`/transactions/${a.transaction}`} className="text-indigo-600">{a.transaction_reference}</Link> },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Alerts</h2>
      {error && <ErrorMessage message={error} />}
      {loading ? <LoadingSpinner /> : <Table columns={columns} data={data} />}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}