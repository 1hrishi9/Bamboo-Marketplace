import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data);
      } catch (err) {
        alert('Failed to fetch orders: ' + (err.response?.data?.msg || 'Unknown error'));
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Order History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
                <span className={`text-sm font-medium px-2 py-1 rounded ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
              <div className="mt-2">
                {order.products.map((item) => (
                  <div key={item.productId._id} className="flex items-center space-x-4">
                    <img
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => (e.target.src = 'https://placehold.co/150x150')}
                    />
                    <div>
                      <p className="font-medium">{item.productId.name}</p>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-gray-600">Price: ${item.productId.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to={`/order/${order._id}`}
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                View Bill & Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;