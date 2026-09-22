# SmartShop – Simple Product Discovery and Recommendation System

A MERN stack hackathon MVP: browse, search, filter, favourite, and get simple
category-based recommendations. Admins can manage products.

---

## 1. Project Overview

SmartShop is a lightweight e-commerce-style discovery app. It is **not** a
full shopping cart / checkout system — it focuses only on:

- Product browsing, searching, and category filtering
- Product detail viewing (which logs a `VIEW` activity)
- Favouriting products (logs a `FAVOURITE` activity)
- A simple recommendation section driven by the user's own activity history
- A minimal admin panel for product CRUD + availability toggling
- Very simple localStorage-based login/register (no JWT, no sessions)

## 2. Final Feature List

| Feature | Status |
|---|---|
| Homepage with search, categories, product cards | ✅ |
| Search by product name | ✅ |
| Category filter | ✅ |
| Product details page + VIEW activity logging | ✅ |
| Register / Login / Logout (localStorage only) | ✅ |
| Favourites (add/remove + Favourites page) | ✅ |
| Recommendation section (category-based) | ✅ |
| Admin dashboard: add/edit/delete/toggle availability | ✅ |
| Basic validation (required fields, email format, positive price, unique email) | ✅ |
| 22 sample products across 7 categories | ✅ |

## 3. Folder Structure

```
smartshop/
├── client/
│   ├── src/
│   │   ├── components/       (Navbar, ProductCard, CategoryFilter, ProductList)
│   │   ├── pages/             (Home, Login, Register, ProductDetails, Favourites, AdminDashboard)
│   │   ├── api.js              (axios instance pointing at the backend)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── models/                (User.js, Product.js, Activity.js)
│   ├── routes/                (auth.js, products.js, activities.js, favourites.js, recommendations.js)
│   ├── server.js
│   ├── seed.js                (loads 22 sample products + a default admin)
│   ├── .env
│   └── package.json
│
└── README.md
```

## 4. Installation Commands

You need **Node.js** (v18+) and a **local MongoDB Community Server** running.

```bash
# From the smartshop/ root folder

# 1. Install backend dependencies
cd server
npm install

# 2. Install frontend dependencies
cd ../client
npm install
```

## 5. MongoDB Setup

1. Install MongoDB Community Server and make sure the service is running
   locally (default port `27017`).
2. Open **MongoDB Compass** and connect to:
   ```
   mongodb://127.0.0.1:27017
   ```
3. You do not need to manually create the database or collections —
   Mongoose will create the `smartshop_db` database and the `users`,
   `products`, and `activities` collections automatically the first time
   data is written (e.g. when you run the seed script below).
4. The connection string is already set in `server/.env`:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/smartshop_db
   ```

## 6. Backend Setup

```bash
cd server

# Seed the database with 22 sample products and a default admin account
npm run seed
```

This prints something like:
```
Inserted 22 sample products.
Created default admin -> email: admin@smartshop.com | password: admin123
```

Then start the backend:

```bash
npm start
# or, for auto-reload during development:
npm run dev
```

You should see:
```
MongoDB connected: mongodb://127.0.0.1:27017/smartshop_db
Server running on http://localhost:5000
```

Open `http://localhost:5000` in a browser — you should see
`SmartShop API is running`.

## 7. Frontend Setup

In a **second terminal**:

```bash
cd client
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

> The frontend is hardcoded to call the backend at `http://localhost:5000/api`
> (see `client/src/api.js`). If you run the backend on a different port,
> update that file.

---

## 8. API Routes Reference

**Auth**
- `POST /api/auth/register` — body: `{ name, email, password }`
- `POST /api/auth/login` — body: `{ email, password }`

**Products**
- `GET /api/products?search=hp&category=Laptops`
- `GET /api/products/:id`
- `POST /api/products` — admin add
- `PUT /api/products/:id` — admin edit / toggle availability
- `DELETE /api/products/:id`

**Activities**
- `POST /api/activities` — body: `{ userId, productId, activityType }` (`VIEW` or `FAVOURITE`)
- `GET /api/activities/user/:userId`

**Favourites**
- `GET /api/favourites/:userId` — returns the user's currently favourited products
- `POST /api/favourites` — body: `{ userId, productId }` (toggles favourite on/off)

**Recommendations**
- `GET /api/recommendations/:userId`

---

## 9. Testing Checklist

- [ ] `npm run seed` inserts 22 products and one admin user without errors
- [ ] Backend starts and connects to MongoDB (`server running on :5000`)
- [ ] Frontend loads homepage and shows product cards with images, price, category, availability
- [ ] Typing "HP" in the search bar filters to HP products only
- [ ] Clicking a category button filters the product grid to that category
- [ ] Clicking "All" clears the category filter
- [ ] Register a new user → auto-logged in → name appears in navbar
- [ ] Logout clears the session and hides Favourites/Admin links
- [ ] Login with wrong password shows an error message
- [ ] Registering with an already-used email shows "Email is already registered"
- [ ] Viewing a product detail page (while logged in) saves a `VIEW` activity (check MongoDB Compass → `activities` collection)
- [ ] Clicking "☆ Favourite" on a card/detail page adds it and updates the button to "★ Favourited"
- [ ] Clicking it again removes the favourite
- [ ] Favourites page shows only the user's favourited products
- [ ] Recommended section appears on homepage after viewing/favouriting a few products in one category, and shows more products from that category
- [ ] A user with no activity sees random/popular products in the recommended section
- [ ] Logging in as `admin@smartshop.com` / `admin123` shows "Admin Dashboard" in the navbar
- [ ] A normal user does NOT see the Admin Dashboard link and gets "Access denied" if they visit `/admin` directly
- [ ] Admin can add a new product and it immediately appears in the table and on the homepage
- [ ] Admin can edit a product's fields and save
- [ ] Admin can toggle a product's availability with one click
- [ ] Admin can delete a product
- [ ] Unavailable products still show in the grid marked "Out of Stock" but are excluded from recommendations
- [ ] Adding a product with a negative price is rejected with a validation error

---

## 10. Demo Flow (suggested, ~4–5 minutes)

1. **Show the homepage** — point out search bar, category buttons, product cards.
2. **Search** "Redmi" → show filtered results.
3. **Filter by category** "Laptops" → show only laptops. Click "All" to reset.
4. **Register a new user** (e.g. "Priya") → show name in navbar.
5. **View 2–3 laptop products** (this logs `VIEW` activities) → open MongoDB
   Compass and show the new documents in the `activities` collection.
6. **Favourite one product** → show the star icon toggle.
7. **Go back to Home** → point out the new "Recommended for You" section
   showing more laptops, with the reason text.
8. **Go to Favourites page** → show the favourited product; remove it and
   show it disappears.
9. **Logout, login as admin** (`admin@smartshop.com` / `admin123`).
10. **Open Admin Dashboard** → add a new product, edit an existing one,
    toggle its availability, then delete a test product.
11. Briefly show the **backend code / routes** and **MongoDB collections**
    in Compass to demonstrate the full stack.

---

## 11. Possible Evaluator Questions & Answers

**Q: Why didn't you use JWT or password hashing?**
A: The problem statement explicitly asked for a very simple email/password
flow using localStorage for a hackathon demo, not production-grade auth. In
a real product we'd hash passwords with bcrypt and use JWT or sessions for
security.

**Q: How does your recommendation engine work? Is it AI/ML?**
A: No ML is used. It's rule-based: every time a user views or favourites a
product, we log an `Activity` document with that product's category. When
the homepage loads, we count activity per category for that user
(favourites weighted higher than views), pick the category with the highest
score, and show available products from that category. If the user has no
activity yet, we show a random sample of available products instead.

**Q: Why store activity as a separate collection instead of an array inside User?**
A: Keeping `activities` as its own collection makes it easy to query,
aggregate, and extend (e.g. adding a "recently viewed" feature later)
without repeatedly rewriting large arrays inside user documents — a more
scalable pattern in MongoDB.

**Q: How do favourites work under the hood — is there a separate Favourites collection?**
A: No — a favourite is just an `Activity` document with
`activityType: "FAVOURITE"`. Adding/removing a favourite toggles that
record. This keeps the schema simple, as required by the assignment
(only `users`, `products`, `activities`).

**Q: How does the admin role check work?**
A: Each user has a `role` field (`"user"` or `"admin"`) set at
registration or seeded directly. The frontend reads the logged-in user
object from localStorage and only renders/permits the Admin Dashboard route
when `role === "admin"`. This is a UI-level check appropriate for a demo;
a production app would also enforce this server-side on every admin route.

**Q: What validation do you have?**
A: Required fields can't be empty, email format is validated with a regex,
price must be a positive number, duplicate emails are rejected at
registration (via a MongoDB unique index + an explicit check), and
unavailable products are filtered out of both the product listing query
context and the recommendation results.

**Q: Why Vite instead of Create React App?**
A: Vite offers much faster dev server startup and hot-module reload, which
is ideal for a time-boxed 5-hour hackathon.

**Q: What would you improve with more time?**
A: See section 13 below (Future Improvements).

---

## 12. Explanation of the Recommendation Logic

1. Every `VIEW` and `FAVOURITE` action is stored as an `Activity` document
   with the product's `category` denormalized onto it (so we don't need a
   join/populate just to count categories).
2. `GET /api/recommendations/:userId`:
   - Fetches all activities for that user.
   - If there are none, returns 8 random **available** products
     (`$sample` aggregation stage) with the message "Popular picks for you
     to explore."
   - Otherwise, tallies a score per category — `FAVOURITE` counts double a
     `VIEW` (since favouriting is a stronger signal of interest) — and
     picks the category with the highest score.
   - Returns up to 8 **available** products from that top category, with a
     message like *"Recommended because you recently viewed or favourited
     products in Laptops."*
3. This is intentionally simple, deterministic, and easy to explain live —
   no external ML libraries, no training data, just a `count` + `sort`.

## 13. Explanation of MongoDB Usage

- **Database**: `smartshop_db`, accessed via Mongoose from a single
  `MONGO_URI` in `server/.env`.
- **Collections**:
  - `users` — name, email (unique), password (plain text, demo only), role
  - `products` — name, description, price, category (enum-restricted),
    image, availability
  - `activities` — userId, productId (both ObjectId refs), category
    (denormalized), activityType (`VIEW`/`FAVOURITE`), createdAt
- **Relationships**: `activities.userId` references `users._id`, and
  `activities.productId` references `products._id`. We use
  `.populate("productId")` when we need full product details attached to
  an activity (e.g. `GET /api/activities/user/:userId`).
- **Indexes**: `email` has a unique index on the User schema to enforce
  no duplicate accounts at the database level (as a safety net alongside
  the explicit check in the register route).
- **Aggregation**: the recommendation route uses `$sample` to pick random
  documents efficiently when there's no user activity to go on.

## 14. Explanation of localStorage Authentication

- On successful login/register, the backend returns a plain user object
  (`_id`, `name`, `email`, `role` — **no password**).
- The frontend stores this object as JSON under the key
  `smartshop_user` in the browser's `localStorage`.
- `Navbar.jsx` reads this on mount to decide whether to show
  Login/Register or the user's name + Logout button, and whether to show
  the Admin Dashboard link.
- Every page that needs to know "who is logged in" (Home, ProductDetails,
  Favourites, AdminDashboard) reads the same `smartshop_user` key directly
  from `localStorage` rather than using a global auth context — kept
  simple on purpose for a 5-hour build.
- Logout simply removes that key and reloads the page.
- **This is not secure for production** — there's no token, no
  expiry, no encryption, and anyone with browser dev tools could edit the
  stored object. It's explicitly scoped to a hackathon demo, as the
  assignment specifies.

## 15. Future Improvements

- Hash passwords with bcrypt; move to JWT-based auth with proper session
  expiry.
- Enforce the admin role check on the server for every product-mutating
  route (currently only enforced in the UI).
- Add pagination / infinite scroll for the product grid.
- Add a proper image upload (currently just an image URL field).
- Add a "Recently Viewed" section using the existing `activities` data.
- Add unit/integration tests (e.g. Jest + Supertest for the API).
- Move category list into its own collection so admins can manage
  categories dynamically instead of a hardcoded enum.
- Add server-side pagination/rate limiting on activity logging to avoid
  spammy duplicate `VIEW` events.
#   S m a r t S h o p  
 