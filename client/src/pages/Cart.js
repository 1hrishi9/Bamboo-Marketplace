import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchCartWithDetails = async () => {
      try {
        const userRes = await api.get('/auth/me');
        const cart = userRes.data.cart || [];
        const productsRes = await api.get('/products');
        const products = productsRes.data;

        const cartWithDetails = cart.map((item) => {
          const product = products.find((p) => p._id === item.productId);
          return {
            ...item,
            name: product ? product.name : 'Unknown Product',
            price: product ? product.price : 0,
            image: product ? product.image : 'https://placehold.co/150x150',
          };
        });

        setCartItems(cartWithDetails);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setCartItems([]);
        navigate('/login');
      }
    };

    fetchCartWithDetails();
  }, [navigate]);

  const handleRemoveItem = async (productId) => {
    try {
      const updatedCart = cartItems.filter((item) => item.productId !== productId);
      await api.post('/auth/me', { cart: updatedCart });
      setCartItems(updatedCart);
      alert('Item removed from cart!');
    } catch (err) {
      alert('Failed to remove item: ' + (err.response?.data?.msg || 'Unknown error'));
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    if (window.confirm('Are you sure you want to place this order?')) {
      try {
        const formattedCart = cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }));
        await api.post('/orders/checkout', { products: formattedCart });
        alert('Order placed successfully!');
        setCartItems([]);
        navigate('/success');
      } catch (err) {
        alert('Checkout failed: ' + (err.response?.data?.msg || 'Unknown error'));
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex items-center p-4 bg-white rounded shadow">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover mr-4"
                  onError={(e) => (e.target.src = 'https://placehold.co/150x150')}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p>Price: ${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="ml-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleCheckout}
            className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;