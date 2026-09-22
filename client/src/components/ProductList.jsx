import ProductCard from "./ProductCard.jsx";

function ProductList({ products, favouriteIds, onToggleFavourite }) {
  if (!products || products.length === 0) {
    return <p className="empty-message">No products found.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          isFavourite={favouriteIds.includes(product._id)}
          onToggleFavourite={onToggleFavourite}
        />
      ))}
    </div>
  );
}

export default ProductList;
