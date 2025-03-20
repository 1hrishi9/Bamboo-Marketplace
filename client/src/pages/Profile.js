import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        alert('Failed to fetch profile: ' + (err.response?.data?.msg || 'Unknown error'));
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl font-semibold text-gray-700">{user.name[0]}</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.phone}</p>
            <p className="text-gray-600 capitalize">{user.role}</p>
          </div>
        </div>
        <div className="space-y-4">
          <Link to="/orders" className="block bg-blue-100 text-blue-700 p-3 rounded-lg hover:bg-blue-200">
            View Order History
          </Link>
          <button className="block w-full bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200">
            Edit Profile
          </button>
          <button className="block w-full bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;