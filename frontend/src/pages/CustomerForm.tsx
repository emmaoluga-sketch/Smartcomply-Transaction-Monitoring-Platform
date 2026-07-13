import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCustomer, updateCustomer, getCustomer, Customer } from '../api/customers';
import toast from 'react-hot-toast';

export default function CustomerForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<Customer>>({
    name: '',
    email: '',
    country: '',
    is_high_risk: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getCustomer(Number(id)).then(res => setForm(res.data)).catch(() => toast.error('Failed to load customer'));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && id) {
        await updateCustomer(Number(id), form);
        toast.success('Customer updated');
      } else {
        await createCustomer(form);
        toast.success('Customer created');
      }
      navigate('/customers');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Customer' : 'New Customer'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input name="name" value={form.name || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="email" value={form.email || ''} onChange={handleChange} type="email" className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Country</label>
          <input name="country" value={form.country || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <input name="is_high_risk" type="checkbox" checked={form.is_high_risk || false} onChange={handleChange} id="highRisk" />
          <label htmlFor="highRisk">High Risk Customer</label>
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={() => navigate('/customers')} className="border px-4 py-2 rounded hover:bg-gray-100">Cancel</button>
        </div>
      </form>
    </div>
  );
}