import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api.js";

function getUser() {
  const stored = localStorage.getItem("smartshop_user");
  return stored ? JSON.parse(stored) : null;
}

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);

        // Log a VIEW activity only if a user is logged in
        if (user) {
          await api.post("/activities", {
            userId: user._id,
            productId: id,
            activityType: "VIEW",
          });

          const favRes = await api.get(`/favourites/${user._id}`);
          setIsFavourite(favRes.data.some((p) => p._id === id));
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleToggleFavourite = async () => {
    if (!user) {
      alert("Please login to favourite products.");
      return;
    }
    try {
      const res = await api.post("/favourites", { userId: user._id, productId: id });
      setIsFavourite(res.data.favourited);
    } catch (err) {
      console.error("Failed to toggle favourite", err);
    }
  };

  if (loading) return <p className="page-message">Loading...</p>;
  if (!product) return <p className="page-message">Product not found.</p>;

  return (
    <div className="product-details-page">
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>
      <div className="product-details-card">
        <img src={product.image} alt={product.name} className="product-details-image" />
        <div className="product-details-info">
          <h2>{product.name}</h2>
          <p className="product-category">{product.category}</p>
          <p className="product-details-description">{product.description}</p>
          <p className="product-price">₹{product.price}</p>
          <p className={product.availability ? "available" : "unavailable"}>
            {product.availability ? "In Stock" : "Out of Stock"}
          </p>
          <button
            className={`btn ${isFavourite ? "btn-fav-active" : "btn-secondary"}`}
            onClick={handleToggleFavourite}
          >
            {isFavourite ? "★ Favourited" : "☆ Add to Favourite"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
