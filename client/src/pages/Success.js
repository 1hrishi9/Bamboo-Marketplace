import { Link } from 'react-router-dom';

function Success() {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Thanks for Your Order!</h1>
      <p className="text-gray-600 mb-4">Your order has been placed successfully. You can track your order status in your order history.</p>
      <Link to="/orders" className="inline-block bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
        View Order History
      </Link>
    </div>
  );
}

export default Success;