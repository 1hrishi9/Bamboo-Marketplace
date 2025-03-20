import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Success from './pages/Success';
import DealerDashboard from './pages/DealerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem('userRole') || 'citizen';
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    console.log('App.js - userId:', userId, 'userRole:', userRole); // Debug session state
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    const lastActivity = sessionStorage.getItem('lastActivity');
    const currentTime = Date.now();

    if (lastActivity && currentTime - parseInt(lastActivity) > sessionTimeout) {
      handleLogout();
    }

    const updateLastActivity = () => {
      sessionStorage.setItem('lastActivity', Date.now().toString());
    };

    window.addEventListener('click', updateLastActivity);
    window.addEventListener('keypress', updateLastActivity);
    window.addEventListener('mousemove', updateLastActivity);

    const interval = setInterval(() => {
      const lastActivity = sessionStorage.getItem('lastActivity');
      const currentTime = Date.now();
      if (lastActivity && currentTime - parseInt(lastActivity) > sessionTimeout) {
        handleLogout();
      }
    }, 60 * 1000);

    return () => {
      window.removeEventListener('click', updateLastActivity);
      window.removeEventListener('keypress', updateLastActivity);
      window.removeEventListener('mousemove', updateLastActivity);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('lastActivity');
    sessionStorage.removeItem('token');
    alert('Session expired or logged out successfully!');
    navigate('/login');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <nav className="bg-green-700 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-white text-xl font-bold">Bamboo Marketplace</Link>
            <div className="space-x-4">
              {!userId ? (
                <>
                  <Link to="/login" className="text-white hover:text-green-200">Login</Link>
                  <Link to="/register" className="text-white hover:text-green-200">Register</Link>
                </>
              ) : (
                <>
                  <Link to="/cart" className="text-white hover:text-green-200">Cart</Link>
                  <Link to="/orders" className="text-white hover:text-green-200">Orders</Link>
                  <Link to="/profile" className="text-white hover:text-green-200">My Account</Link>
                  {userRole === 'dealer' && (
                    <Link to="/dealer-dashboard" className="text-white hover:text-green-200">Dealer Dashboard</Link>
                  )}
                  {userRole === 'superadmin' && (
                    <Link to="/admin-dashboard" className="text-white hover:text-green-200">Admin Dashboard</Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-green-200"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<ProtectedRoute allowedRoles={['citizen', 'dealer', 'superadmin']}><Cart /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute allowedRoles={['citizen', 'dealer', 'superadmin']}><Orders /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['citizen', 'dealer', 'superadmin']}><Profile /></ProtectedRoute>} />
          <Route path="/success" element={<Success />} />
          <Route path="/dealer-dashboard" element={<ProtectedRoute allowedRoles={['dealer']}><DealerDashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}