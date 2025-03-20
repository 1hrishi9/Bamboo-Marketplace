import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/user-orders');
        setOrders(res.data);
      } catch (err) {
        setError('Failed to fetch orders: ' + (err.response?.data?.msg || 'Unknown error'));
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchOrders();
  }, [navigate]);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">My Orders</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded shadow">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={`inline-block px-2 py-1 rounded text-white ${
                    order.status === 'Delivered'
                      ? 'bg-green-500'
                      : order.status === 'Cancelled'
                      ? 'bg-red-500'
                      : order.status === 'Shipped'
                      ? 'bg-blue-500'
                      : order.status === 'Packing'
                      ? 'bg-yellow-500'
                      : order.status === 'Accepted'
                      ? 'bg-purple-500'
                      : 'bg-gray-500'
                  }`}
                >
                  {order.status || 'Pending'}
                </span>
              </p>
              <p><strong>Products:</strong></p>
              <ul className="list-disc pl-5">
                {order.products.map((item) => (
                  <li key={item.productId._id}>
                    {item.productId.name} - Quantity: {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;