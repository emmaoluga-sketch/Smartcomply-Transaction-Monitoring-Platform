import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTransaction, updateTransaction, getTransaction, Transaction } from '../api/transactions';
import { getCustomers, Customer } from '../api/customers';
import toast from 'react-hot-toast';

export default function TransactionForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<Transaction>>({
    reference: '',
    customer: 0,
    amount: '',
    currency: 'USD',
    transaction_type: 'DEPOSIT',
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCustomers({ page: 1 }).then(res => setCustomers(res.data.results));
    if (id) {
      getTransaction(Number(id)).then(res => setForm(res.data)).catch(() => toast.error('Failed to load'));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        amount: String(form.amount),
        customer: Number(form.customer),
      };
      if (isEdit && id) {
        await updateTransaction(Number(id), payload as any);
        toast.success('Transaction updated');
      } else {
        await createTransaction(payload as any);
        toast.success('Transaction created');
      }
      navigate('/transactions');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Transaction' : 'New Transaction'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Reference</label>
          <input name="reference" value={form.reference || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Customer</label>
          <select name="customer" value={form.customer || ''} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">Select customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input name="amount" type="number" step="0.01" value={form.amount || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Currency</label>
          <input name="currency" value={form.currency || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Type</label>
          <select name="transaction_type" value={form.transaction_type} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="DEPOSIT">Deposit</option>
            <option value="WITHDRAWAL">Withdrawal</option>
            <option value="TRANSFER">Transfer</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={() => navigate('/transactions')} className="border px-4 py-2 rounded hover:bg-gray-100">Cancel</button>
        </div>
      </form>
    </div>
  );
}