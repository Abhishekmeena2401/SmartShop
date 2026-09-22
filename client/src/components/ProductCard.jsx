import { Link } from "react-router-dom";

function ProductCard({ product, onToggleFavourite, isFavourite }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-price">₹{product.price}</p>
        <p className={product.availability ? "available" : "unavailable"}>
          {product.availability ? "In Stock" : "Out of Stock"}
        </p>

        <div className="product-actions">
          <Link to={`/product/${product._id}`} className="btn btn-primary btn-small">
            View Details
          </Link>
          <button
            className={`btn btn-small ${isFavourite ? "btn-fav-active" : "btn-secondary"}`}
            onClick={() => onToggleFavourite(product._id)}
          >
            {isFavourite ? "★ Favourited" : "☆ Favourite"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
