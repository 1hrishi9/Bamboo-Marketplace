import { useEffect, useState } from 'react';
import api from '../services/api';

function DealerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);

  const categories = [
    'Bamboo Products',
    'Food',
    'Decor',
  ];

  useEffect(() => {
    const fetchDealerData = async () => {
      try {
        console.log('Fetching products...');
        const productRes = await api.get('/products');
        console.log('Products response:', productRes.data);
        const dealerProducts = productRes.data.filter(
          (product) => product.dealerId === sessionStorage.getItem('userId')
        );
        setProducts(dealerProducts);

        console.log('Fetching orders...');
        const orderRes = await api.get('/orders/my-orders');
        console.log('Orders response:', orderRes.data);
        setOrders(orderRes.data);
      } catch (err) {
        console.error('Error fetching dealer data:', err.response?.data || err.message);
        setError('Failed to fetch data: ' + (err.response?.data?.msg || 'Unknown error'));
      }
    };
    fetchDealerData();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/products', {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        image,
        category,
      });
      setProducts([...products, res.data]);
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setImage('');
      setCategory('');
      alert('Product added successfully!');
    } catch (err) {
      alert('Failed to add product: ' + (err.response?.data?.msg || 'Unknown error'));
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const res = await api.put(`/orders/my-orders/${orderId}`, { status });
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: res.data.status } : order
        )
      );
      alert('Order status updated!');
    } catch (err) {
      alert('Failed to update order status: ' + (err.response?.data?.msg || 'Unknown error'));
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Dealer Dashboard</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dealer Dashboard</h1>

      {/* Add New Product Form */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="bg-white p-6 rounded shadow">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="image">Image URL</label>
            <input
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* Your Products Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Products</h2>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product._id} className="bg-white p-4 rounded shadow">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4"
                  onError={(e) => (e.target.src = 'https://placehold.co/150x150')}
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p>{product.description}</p>
                <p className="text-green-600 font-bold">${product.price}</p>
                <p>Stock: {product.stock}</p>
                <p>Category: {product.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Your Orders Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-4 rounded shadow">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Placed By:</strong> {order.userId.name} ({order.userId.email})</p>
                <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {order.status || 'Pending'}</p>
                <p><strong>Products:</strong></p>
                <ul className="list-disc pl-5">
                  {order.products
                    .filter((item) => item.productId && item.productId.dealerId === sessionStorage.getItem('userId'))
                    .map((item) => (
                      <li key={item.productId._id}>
                        {item.productId.name} - Quantity: {item.quantity}
                      </li>
                    ))}
                </ul>
                <div className="mt-2">
                  <label className="block text-gray-700 mb-1">Update Status:</label>
                  <select
                    value={order.status || 'Pending'}
                    onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DealerDashboard;