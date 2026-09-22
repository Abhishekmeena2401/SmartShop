const CATEGORIES = [
  "Laptops",
  "Mobiles",
  "Earphones",
  "Headphones",
  "TVs",
  "ACs",
  "Refrigerators",
];

function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="category-filter">
      <button
        className={`category-btn ${selectedCategory === "" ? "active" : ""}`}
        onClick={() => onSelectCategory("")}
      >
        All
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
          onClick={() => onSelectCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
