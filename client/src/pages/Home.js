import { useEffect, useState } from 'react';
import api from '../services/api';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products')
      .then((res) => {
        console.log('Products fetched:', res.data); // Log the response
        setProducts(res.data || []);
      })
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  const addToCart = async (productId) => {
    try {
      const response = await api.post('/auth/me', { cart: [{ productId, quantity: 1 }] });
      console.log('Add to cart response:', response.data);
      alert('Added to cart!');
    } catch (err) {
      console.error('Add to cart error:', err);
      alert('Failed to add to cart: ' + (err.response?.data?.msg || err.message || 'Unknown error'));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-green-700">Bamboo Marketplace</h1>
      {products.length === 0 ? (
        <p>No products available yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="p-4 bg-white rounded shadow">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) => (e.target.src = 'https://placehold.co/150x150')}
              />
              <h2 className="text-xl">{product.name}</h2>
              <p>${product.price}</p>
              <button
                onClick={() => addToCart(product._id)}
                className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;