import { useEffect, useState } from "react";
import api from "../api.js";
import ProductList from "../components/ProductList.jsx";

function getUser() {
  const stored = localStorage.getItem("smartshop_user");
  return stored ? JSON.parse(stored) : null;
}

function Favourites() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchFavourites = async () => {
      try {
        const res = await api.get(`/favourites/${user._id}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch favourites", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, []);

  const handleToggleFavourite = async (productId) => {
    try {
      await api.post("/favourites", { userId: user._id, productId });
      // Remove it from the visible list immediately since this page only shows favourites
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Failed to toggle favourite", err);
    }
  };

  if (!user) {
    return <p className="page-message">Please login to view your favourites.</p>;
  }

  if (loading) return <p className="page-message">Loading...</p>;

  return (
    <div className="favourites-page">
      <h2>My Favourites</h2>
      <ProductList
        products={products}
        favouriteIds={products.map((p) => p._id)}
        onToggleFavourite={handleToggleFavourite}
      />
    </div>
  );
}

export default Favourites;
