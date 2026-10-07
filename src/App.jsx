import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import Footer from "./components/Footer";

function App() {
  // Cart
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("shopsphere-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Search
  const [search, setSearch] = useState("");

  //Products from backend
  const [products, setProducts] = useState([]);

  // Category
  const [category, setCategory] = useState("All");

  // Selected product
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Checkout
  const [showCheckout, setShowCheckout] = useState(false);

  const [orderPlaced, setOrderPlaced] = useState(false);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem(
      "shopsphere-cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  // Get products from Spring Boot backend
useEffect(() => {
  fetch("https://shopsphere-backend-wo31.onrender.com/api/products")
    .then((response) => response.json())
    .then((data) => {
      setProducts(data);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
}, []);

  // Add product to cart
  const addToCart = (product) => {
    const existingProduct = cart.find(
      (item) => item.name === product.name
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.name === product.name
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  // Decrease quantity
  const decreaseQuantity = (index) => {
    const newCart = [...cart];

    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
      setCart(newCart);
    } else {
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  // Remove product from cart
  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  // Search + Category filter
  const filteredProducts = products.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (category === "All" ||
        product.category === category)
  );

  // Total cart items
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Total price
  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <>
      <Header />

      <Hero />

      {/* Cart Count */}
      <h2
        style={{
          textAlign: "center",
          margin: "20px",
          color: "#222",
        }}
      >
        🛒 Cart Items: {totalItems}
      </h2>

      <hr />

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <button
          onClick={() => setCategory("All")}
        >
          All
        </button>

        <button
          onClick={() => setCategory("Laptop")}
        >
          Laptop
        </button>

        <button
          onClick={() => setCategory("Accessories")}
        >
          Accessories
        </button>

        <button
          onClick={() => setCategory("Monitor")}
        >
          Monitor
        </button>
      </div>

      {/* Products */}
      <div className="products">
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.name}
              name={product.name}
              price={product.price}
              image={product.image}
              rating={product.rating}
              description={product.description}
              category={product.category}
              viewDetails={() =>
                setSelectedProduct(product)
              }
              addToCart={() =>
                addToCart(product)
              }
            />
          ))
        )}
      </div>

      {/* Checkout */}
      {showCheckout && (
        <div className="checkout">
          <h2>🛒 Checkout</h2>

          <input
            type="text"
            placeholder="Enter your name"
          />

          <input
            type="tel"
            placeholder="Enter phone number"
          />

          <textarea
            placeholder="Enter delivery address"
          ></textarea>

          <button
            onClick={() => {
            setOrderPlaced(true);
            setCart([]);
            setShowCheckout(false);
          }}
>
          Place Order
        </button>

          <button
            onClick={() =>
              setShowCheckout(false)
            }
          >
            Cancel
          </button>
        </div>
      )}

      {/* Product Details */}
      {selectedProduct && (
        <div className="product-details">
          <button
            onClick={() =>
              setSelectedProduct(null)
            }
          >
            ← Back to Products
          </button>

          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
          />

          <h1>{selectedProduct.name}</h1>

          <p className="rating">
            {"⭐".repeat(
              selectedProduct.rating
            )}
          </p>

          <p>
            Category:{" "}
            {selectedProduct.category}
          </p>

          <p>
            {selectedProduct.description}
          </p>

          <h2>
            Price: $
            {selectedProduct.price}
          </h2>

          <button
            onClick={() =>
              addToCart(selectedProduct)
            }
          >
            🛒 Add to Cart
          </button>
        </div>
      )}

      {/* Cart Section */}
      <div className="cart">
        <h2>🛒 Your Cart</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {/* Cart Products */}
            {cart.map((item, index) => (
              <div
                className="cart-item"
                key={item.name}
              >
                <img
                  src={item.image}
                  alt={item.name}
                />

                <div>
                  <h3>{item.name}</h3>

                  <p>
                    Price: ${item.price}
                  </p>

                  {/* Quantity */}
                  <div>
                    <button
                      onClick={() =>
                        decreaseQuantity(index)
                      }
                    >
                      −
                    </button>

                    <span>
                      {" "}
                      {item.quantity}{" "}
                    </span>

                    <button
                      onClick={() =>
                        addToCart(item)
                      }
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() =>
                      removeFromCart(index)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Total */}
            <h2>
              Total: ${totalPrice}
            </h2>
            
          {/* Checkout Button */}
          <button
            className="checkout-button"
            onClick={() => setShowCheckout(true)}
          >
            Proceed to Checkout
          </button>
          </>
        )}
      </div>
      {orderPlaced && (
        <div className="order-success">
          <h2>🎉 Order Placed Successfully!</h2>
          <p>Thank you for shopping with ShopSphere.</p>

          <button
            onClick={() => setOrderPlaced(false)}
          >
            Continue Shopping
          </button>
        </div>
      )}

      <Footer />
    </>
  );
}

export default App;