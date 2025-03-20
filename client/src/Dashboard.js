import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({ users: 0, dealers: 0, products: 0 });

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/stats', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((res) => setStats(res.data));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-100 rounded">Users: {stats.users}</div>
        <div className="p-4 bg-green-100 rounded">Dealers: {stats.dealers}</div>
        <div className="p-4 bg-yellow-100 rounded">Products: {stats.products}</div>
      </div>
    </div>
  );
}

export default Dashboard;