import { useEffect, useState } from 'react';
import api from '../services/api';

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        setError('Failed to fetch products: ' + (err.response?.data?.msg || 'Unknown error'));
      }
    };
    fetchProducts();
  }, []);

  // Handle search, sort, and category filtering
  useEffect(() => {
    let updatedProducts = [...products];

    // Filter by search query
    if (searchQuery) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter) {
      updatedProducts = updatedProducts.filter(
        (product) => product.category === categoryFilter
      );
    }

    // Sort products
    if (sortOption === 'price-asc') {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updatedProducts);
  }, [searchQuery, sortOption, categoryFilter, products]);

  const handleAddToCart = async (productId) => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      alert('Please log in to add items to your cart.');
      window.location.href = '/login';
      return;
    }

    try {
      const userRes = await api.get('/auth/me');
      const user = userRes.data;
      const cart = user.cart || [];
      const existingItem = cart.find((item) => item.productId === productId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ productId, quantity: 1 });
      }

      await api.post('/auth/me', { cart });
      alert('Product added to cart!');
    } catch (err) {
      alert('Failed to add to cart: ' + (err.response?.data?.msg || 'Unknown error'));
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Home</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Define categories (you can fetch these dynamically from the backend if needed)
  const categories = [
    '',
    'Bamboo Products',
    'Food',
    'Decor',
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Bamboo Marketplace</h1>

      {/* Search, Sort, and Category Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/3"
        />

        {/* Sort Dropdown */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/4"
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>

        {/* Category Dropdown */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/4"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category || 'all'} value={category}>
              {category || 'All Categories'}
            </option>
          ))}
        </select>
      </div>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
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
              <button
                onClick={() => handleAddToCart(product._id)}
                className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;