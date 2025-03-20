import { useEffect, useState } from 'react';
import api from '../services/api';

function DealerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/my-products');
      setProducts(res.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/products', newProduct);
      setProducts([...products, res.data]);
      alert('Product added successfully!');
      setNewProduct({ name: '', description: '', price: '', stock: '', image: '' });
    } catch (err) {
      alert('Failed to add product: ' + (err.response?.data?.msg || 'Unknown error'));
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image,
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/products/${editingProduct._id}`, newProduct);
      setProducts(products.map((p) => (p._id === editingProduct._id ? res.data : p)));
      alert('Product updated successfully!');
      setEditingProduct(null);
      setNewProduct({ name: '', description: '', price: '', stock: '', image: '' });
    } catch (err) {
      alert('Failed to update product: ' + (err.response?.data?.msg || 'Unknown error'));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        setProducts(products.filter((p) => p._id !== productId));
        alert('Product deleted successfully!');
      } catch (err) {
        alert('Failed to delete product: ' + (err.response?.data?.msg || 'Unknown error'));
      }
    }
  };

  const toggleOutOfStock = async (product) => {
    try {
      const updatedProduct = { ...product, stock: product.stock > 0 ? 0 : 1 };
      const res = await api.put(`/products/${product._id}`, updatedProduct);
      setProducts(products.map((p) => (p._id === product._id ? res.data : p)));
      alert(`Product marked as ${updatedProduct.stock === 0 ? 'out of stock' : 'in stock'}`);
    } catch (err) {
      alert('Failed to update stock status: ' + (err.response?.data?.msg || 'Unknown error'));
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/my-orders/${orderId}`, { status: newStatus });
      setOrders(orders.map((order) => (order._id === orderId ? res.data : order)));
      alert('Order status updated!');
    } catch (err) {
      alert('Failed to update order status: ' + (err.response?.data?.msg || 'Unknown error'));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dealer Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="max-w-md">
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            placeholder="Product Name"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="text"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            placeholder="Description"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            placeholder="Price"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="number"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            placeholder="Stock"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="text"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            placeholder="Image URL"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setNewProduct({ name: '', description: '', price: '', stock: '', image: '' });
              }}
              className="ml-2 bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          )}
        </form>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Your Products</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {products.map((product) => (
          <div key={product._id} className="p-4 bg-white rounded shadow">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <h3 className="text-xl">{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stock > 0 ? product.stock : 'Out of Stock'}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleEditProduct(product)}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => toggleOutOfStock(product)}
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
              >
                {product.stock > 0 ? 'Mark Out of Stock' : 'Mark In Stock'}
              </button>
              <button
                onClick={() => handleDeleteProduct(product._id)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <div key={order._id} className="p-4 bg-white rounded shadow">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Customer:</strong> {order.userId.name} ({order.userId.email})</p>
            <p><strong>Status:</strong> {order.status}</p>
            <h3 className="text-lg font-semibold mt-2">Products:</h3>
            <ul className="list-disc pl-5">
              {order.products
                .filter((item) => item.productId.dealerId.toString() === localStorage.getItem('userId'))
                .map((item) => (
                  <li key={item.productId._id}>
                    {item.productId.name} - Quantity: {item.quantity}
                  </li>
                ))}
            </ul>
            <div className="mt-2">
              <label className="mr-2">Update Status:</label>
              <select
                value={order.status}
                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                className="p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Order Accepted">Order Accepted</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DealerDashboard;