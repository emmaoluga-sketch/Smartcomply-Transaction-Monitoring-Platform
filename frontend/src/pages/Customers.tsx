import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers, Customer } from '../api/customers';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { FiPlus, FiEdit } from 'react-icons/fi';

export default function Customers() {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getCustomers({ page, search });
      setData(res.data.results);
      setTotalPages(Math.ceil(res.data.count / 20));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, search]);

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Customer },
    { header: 'Email', accessor: 'email' },
    { header: 'Country', accessor: 'country' },
    { header: 'High Risk', accessor: (c: Customer) => c.is_high_risk ? 'Yes' : 'No' },
    {
      header: 'Actions',
      accessor: (c: Customer) => (
        <div className="flex gap-2">
          <Link to={`/customers/${c.id}/edit`} className="text-indigo-600 hover:text-indigo-800">
            <FiEdit />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Customers</h2>
        <Link
          to="/customers/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-indigo-700"
        >
          <FiPlus /> Add Customer
        </Link>
      </div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search..."
        className="mb-4 p-2 border rounded w-full md:w-1/3"
      />
      {error && <ErrorMessage message={error} />}
      {loading ? <LoadingSpinner /> : <Table columns={columns} data={data} />}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}