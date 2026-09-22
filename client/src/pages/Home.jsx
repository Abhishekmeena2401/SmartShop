import { useEffect, useState } from "react";
import api from "../api.js";
import CategoryFilter from "../components/CategoryFilter.jsx";
import ProductList from "../components/ProductList.jsx";

function getUser() {
  const stored = localStorage.getItem("smartshop_user");
  return stored ? JSON.parse(stored) : null;
}

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [favouriteIds, setFavouriteIds] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = getUser();

  // Fetch products whenever search / category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;
        const res = await api.get("/products", { params });
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category]);

  // Fetch favourites + recommendations for logged-in user
  useEffect(() => {
    if (!user) return;

    const fetchFavourites = async () => {
      try {
        const res = await api.get(`/favourites/${user._id}`);
        setFavouriteIds(res.data.map((p) => p._id));
      } catch (err) {
        console.error("Failed to fetch favourites", err);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const res = await api.get(`/recommendations/${user._id}`);
        setRecommendation(res.data);
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
      }
    };

    fetchFavourites();
    fetchRecommendations();
  }, [user?._id]);

  const handleToggleFavourite = async (productId) => {
    if (!user) {
      alert("Please login to favourite products.");
      return;
    }
    try {
      const res = await api.post("/favourites", { userId: user._id, productId });
      if (res.data.favourited) {
        setFavouriteIds((prev) => [...prev, productId]);
      } else {
        setFavouriteIds((prev) => prev.filter((id) => id !== productId));
      }
    } catch (err) {
      console.error("Failed to toggle favourite", err);
    }
  };

  return (
    <div className="home-page">
      <div className="hero">
        <h1>SmartShop</h1>
        <p>Discover products that match what you love.</p>
        <input
          type="text"
          className="search-bar"
          placeholder="Search products by name (e.g. HP)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <CategoryFilter selectedCategory={category} onSelectCategory={setCategory} />

      {user && recommendation && recommendation.products.length > 0 && (
        <section className="recommend-section">
          <h2>Recommended for You</h2>
          <p className="recommend-reason">{recommendation.reason}</p>
          <ProductList
            products={recommendation.products}
            favouriteIds={favouriteIds}
            onToggleFavourite={handleToggleFavourite}
          />
        </section>
      )}

      <section className="all-products-section">
        <h2>{category ? category : "All Products"}</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <ProductList
            products={products}
            favouriteIds={favouriteIds}
            onToggleFavourite={handleToggleFavourite}
          />
        )}
      </section>
    </div>
  );
}

export default Home;
