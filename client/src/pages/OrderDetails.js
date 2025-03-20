import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/my-orders`);
        const foundOrder = res.data.find((o) => o._id === id);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          alert('Order not found');
        }
      } catch (err) {
        alert('Failed to fetch order: ' + (err.response?.data?.msg || 'Unknown error'));
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <div>Loading...</div>;

  const totalAmount = order.products.reduce((total, item) => total + item.productId.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Order Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
          <span className={`text-sm font-medium px-2 py-1 rounded ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {order.status}
          </span>
        </div>
        <p className="text-gray-600 mb-4">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
        <h3 className="text-lg font-semibold mb-2">Items</h3>
        {order.products.map((item) => (
          <div key={item.productId._id} className="flex items-center space-x-4 mb-4">
            <img
              src={item.productId.image}
              alt={item.productId.name}
              className="w-20 h-20 object-cover rounded"
              onError={(e) => (e.target.src = 'https://placehold.co/150x150')}
            />
            <div>
              <p className="font-medium">{item.productId.name}</p>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-gray-600">Price: ${item.productId.price}</p>
            </div>
          </div>
        ))}
        <h3 className="text-lg font-semibold mb-2">Bill Summary</h3>
        <div className="border-t pt-2">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${totalAmount}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>$10</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${totalAmount + 10}</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold mt-4 mb-2">Shipping Address</h3>
        <p className="text-gray-600">John Doe, 123 Main St, City, Country, 12345</p>
        <h3 className="text-lg font-semibold mt-4 mb-2">Order Status Timeline</h3>
        <div className="space-y-2">
          <p className="text-gray-600">Order Placed: {new Date(order.createdAt).toLocaleString()}</p>
          {order.status === 'Shipped' && <p className="text-gray-600">Shipped: {new Date().toLocaleString()}</p>}
          {order.status === 'Delivered' && <p className="text-gray-600">Delivered: {new Date().toLocaleString()}</p>}
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;