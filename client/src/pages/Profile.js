import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    api.get('/auth/me')
      .then((res) => {
        if (res.data) {
          setUser(res.data);
        } else {
          setError('No user data found. Please log in.');
        }
      })
      .catch((err) => {
        setError('Failed to fetch user data: ' + (err.response?.data?.msg || 'Unknown error'));
        navigate('/login');
      });
  }, [navigate]);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="bg-white p-4 rounded shadow">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
}

export default Profile;