import { useEffect, useState } from 'react';
import api from '../services/api';

function AdminDashboard() {
  const [analytics, setAnalytics] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0 });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setAnalytics(res.data);
      } catch (err) {
        alert('Failed to fetch analytics: ' + (err.response?.data?.msg || 'Unknown error'));
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } catch (err) {
        alert('Failed to fetch users: ' + (err.response?.data?.msg || 'Unknown error'));
      }
    };

    fetchAnalytics();
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter((user) => user._id !== userId));
        alert('User deleted successfully!');
      } catch (err) {
        alert('Failed to delete user: ' + (err.response?.data?.msg || 'Unknown error'));
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Super Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p>{analytics.totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Products</h2>
          <p>{analytics.totalProducts}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <p>{analytics.totalOrders}</p>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <div className="bg-white p-4 rounded shadow">
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;