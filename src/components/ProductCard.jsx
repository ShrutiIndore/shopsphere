function ProductCard(props) {
  return (
    <div className="card">

      {/* Product Image */}
      <img
        src={props.image}
        alt={props.name}
        className="product-image"
      />

      {/* Product Name */}
      <h2>{props.name}</h2>

      {/* Product Rating */}
      <p className="rating">
        {"⭐".repeat(props.rating)}
      </p>

      <p className="category">
      Category: {props.category}
     </p>

      {/* Product Description */}
      <p className="description">
        {props.description}
      </p>

      {/* Product Price */}
      <h3>Price: ${props.price}</h3>

      {/* Add To Cart Button */}
      <button onClick={props.addToCart}>
        Add to Cart
      </button>

      <button onClick={props.viewDetails}>
      View Details
      </button>

    </div>
  );
}

export default ProductCard;