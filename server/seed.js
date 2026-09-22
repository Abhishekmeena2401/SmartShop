require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smartshop_db";

const products = [
  { name: "HP Pavilion 15", description: "HP Pavilion 15, Intel i5, 16GB RAM, 512GB SSD laptop for everyday productivity.", price: 62999, category: "Laptops", image: "https://placehold.co/300x300?text=HP+Pavilion", availability: true },
  { name: "HP Victus Gaming Laptop", description: "HP Victus with RTX 3050, Ryzen 5, great for casual gaming.", price: 74999, category: "Laptops", image: "https://placehold.co/300x300?text=HP+Victus", availability: true },
  { name: "Dell Inspiron 14", description: "Dell Inspiron 14, lightweight and reliable laptop for students.", price: 54999, category: "Laptops", image: "https://placehold.co/300x300?text=Dell+Inspiron", availability: true },
  { name: "Lenovo IdeaPad Slim 3", description: "Compact and affordable laptop for daily browsing and office work.", price: 45999, category: "Laptops", image: "https://placehold.co/300x300?text=Lenovo+IdeaPad", availability: false },
  { name: "ASUS VivoBook 15", description: "ASUS VivoBook 15 with full HD display and long battery life.", price: 49999, category: "Laptops", image: "https://placehold.co/300x300?text=ASUS+VivoBook", availability: true },

  { name: "Samsung Galaxy M14", description: "Samsung Galaxy M14 with 6000mAh battery and 50MP camera.", price: 13999, category: "Mobiles", image: "https://placehold.co/300x300?text=Galaxy+M14", availability: true },
  { name: "Redmi Note 13", description: "Redmi Note 13 with AMOLED display and fast charging.", price: 16999, category: "Mobiles", image: "https://placehold.co/300x300?text=Redmi+Note+13", availability: true },
  { name: "Realme Narzo 60", description: "Realme Narzo 60 with sleek design and great camera performance.", price: 15999, category: "Mobiles", image: "https://placehold.co/300x300?text=Realme+Narzo", availability: true },
  { name: "OnePlus Nord CE 4", description: "OnePlus Nord CE 4 with Snapdragon processor and smooth OxygenOS.", price: 24999, category: "Mobiles", image: "https://placehold.co/300x300?text=OnePlus+Nord", availability: false },

  { name: "boAt Rockerz 255", description: "Wireless neckband earphones with up to 40 hours of playback.", price: 999, category: "Earphones", image: "https://placehold.co/300x300?text=boAt+Rockerz", availability: true },
  { name: "OnePlus Buds Z2", description: "True wireless earbuds with active noise cancellation.", price: 2799, category: "Earphones", image: "https://placehold.co/300x300?text=OnePlus+Buds", availability: true },
  { name: "Realme Buds Wireless 3", description: "Neckband earphones with fast charging and deep bass.", price: 1499, category: "Earphones", image: "https://placehold.co/300x300?text=Realme+Buds", availability: true },

  { name: "boAt Rockerz 450", description: "Over-ear wireless headphones with 15 hours of battery backup.", price: 1499, category: "Headphones", image: "https://placehold.co/300x300?text=boAt+Rockerz+450", availability: true },
  { name: "JBL Tune 760NC", description: "Noise-cancelling over-ear headphones with punchy JBL sound.", price: 4999, category: "Headphones", image: "https://placehold.co/300x300?text=JBL+Tune+760", availability: true },
  { name: "Sony WH-CH520", description: "Lightweight wireless headphones with up to 50 hours playback.", price: 4490, category: "Headphones", image: "https://placehold.co/300x300?text=Sony+WH-CH520", availability: false },

  { name: "Samsung Crystal 4K 55-inch", description: "Samsung 55-inch Crystal UHD 4K Smart TV with vibrant colours.", price: 44999, category: "TVs", image: "https://placehold.co/300x300?text=Samsung+4K+TV", availability: true },
  { name: "Mi TV 5A 43-inch", description: "Mi 43-inch Full HD Android Smart TV, great value for money.", price: 22999, category: "TVs", image: "https://placehold.co/300x300?text=Mi+TV+5A", availability: true },
  { name: "LG 32-inch HD Smart TV", description: "LG 32-inch HD Ready Smart TV, compact and reliable.", price: 15999, category: "TVs", image: "https://placehold.co/300x300?text=LG+32+TV", availability: true },

  { name: "Voltas 1.5 Ton Split AC", description: "Voltas 1.5 Ton 3 Star Split AC with fast cooling.", price: 32999, category: "ACs", image: "https://placehold.co/300x300?text=Voltas+AC", availability: true },
  { name: "LG 1 Ton Split AC", description: "LG 1 Ton 5 Star Inverter Split AC, energy efficient.", price: 38999, category: "ACs", image: "https://placehold.co/300x300?text=LG+AC", availability: false },

  { name: "Samsung 253L Double Door Refrigerator", description: "Samsung 253L frost-free double door refrigerator.", price: 27999, category: "Refrigerators", image: "https://placehold.co/300x300?text=Samsung+Fridge", availability: true },
  { name: "LG 190L Single Door Refrigerator", description: "LG 190L direct-cool single door refrigerator, compact size.", price: 15999, category: "Refrigerators", image: "https://placehold.co/300x300?text=LG+Fridge", availability: true },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding:", MONGO_URI);

    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`Inserted ${products.length} sample products.`);

    // Create a default admin account if it doesn't already exist
    const adminEmail = "admin@smartshop.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: "admin123",
        role: "admin",
      });
      console.log(`Created default admin -> email: ${adminEmail} | password: admin123`);
    } else {
      console.log("Default admin already exists, skipping creation.");
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
