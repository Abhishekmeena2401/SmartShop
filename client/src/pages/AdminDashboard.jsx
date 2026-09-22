import { useEffect, useState } from "react";
import api from "../api.js";

const CATEGORIES = [
  "Laptops",
  "Mobiles",
  "Earphones",
  "Headphones",
  "TVs",
  "ACs",
  "Refrigerators",
];

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: CATEGORIES[0],
  image: "",
  availability: true,
};

function getUser() {
  const stored = localStorage.getItem("smartshop_user");
  return stored ? JSON.parse(stored) : null;
}

function AdminDashboard() {
  const user = getUser();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") fetchProducts();
  }, []);

  if (!user || user.role !== "admin") {
    return <p className="page-message">Access denied. Admins only.</p>;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.description.trim() || !form.image.trim()) {
      setError("Name, description and image URL are required.");
      return;
    }
    if (Number(form.price) <= 0) {
      setError("Price must be a positive number.");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
      } else {
        await api.post("/products", form);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      availability: product.availability,
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const handleToggleAvailability = async (product) => {
    try {
      await api.put(`/products/${product._id}`, {
        availability: !product.availability,
      });
      fetchProducts();
    } catch (err) {
      console.error("Failed to update availability", err);
    }
  };

  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
        {error && <p className="error-text">{error}</p>}

        <label>Product Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} required />

        <label>Price (₹)</label>
        <input type="number" name="price" value={form.price} onChange={handleChange} min="0" required />

        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label>Image URL</label>
        <input type="text" name="image" value={form.image} onChange={handleChange} required />

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="availability"
            checked={form.availability}
            onChange={handleChange}
          />
          Available
        </label>

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary">
            {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3>All Products ({products.length})</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
                <td>
                  <button
                    className={`btn btn-small ${p.availability ? "btn-fav-active" : "btn-secondary"}`}
                    onClick={() => handleToggleAvailability(p)}
                  >
                    {p.availability ? "Available" : "Unavailable"}
                  </button>
                </td>
                <td>
                  <button className="btn btn-small btn-secondary" onClick={() => handleEdit(p)}>
                    Edit
                  </button>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(p._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
