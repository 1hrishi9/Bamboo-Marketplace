import axios from 'axios';
import { useEffect, useState } from 'react';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products').then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Bamboo Marketplace</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="p-4 bg-white rounded shadow">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <h2 className="text-xl">{product.name}</h2>
            <p>${product.price}</p>
            <button className="mt-2 bg-green-500 text-white p-2 rounded">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;