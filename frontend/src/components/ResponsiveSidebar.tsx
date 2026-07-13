import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded text-sm font-medium ${
      isActive ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-600'
    }`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between bg-indigo-700 p-4">
        <h1 className="text-xl font-bold text-white">Smartcomply</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:flex md:flex-col md:w-64 bg-indigo-700 text-white p-5 fixed md:static inset-0 z-40`}
      >
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold">Smartcomply</h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <FiX size={24} />
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink to="/dashboard" className={linkClass} onClick={() => setSidebarOpen(false)}>Dashboard</NavLink>
          <NavLink to="/transactions" className={linkClass} onClick={() => setSidebarOpen(false)}>Transactions</NavLink>
          <NavLink to="/customers" className={linkClass} onClick={() => setSidebarOpen(false)}>Customers</NavLink>
          <NavLink to="/alerts" className={linkClass} onClick={() => setSidebarOpen(false)}>Alerts</NavLink>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 px-3 py-2 text-red-200 hover:bg-red-600 rounded"
        >
          <FiLogOut /> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}