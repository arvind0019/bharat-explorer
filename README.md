# 🇮🇳 Bharat Explorer — Full Stack Tourism Platform

A complete AI-powered travel and cultural exploration platform for India with 5000+ destinations, interactive map, AI trip planner, chatbot, authentication, and admin dashboard.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT + bcryptjs |
| **Routing** | React Router v6 |
| **HTTP** | Axios |

---

## 📁 Folder Structure

```
bharat-explorer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PlaceCard.jsx
│   │   │   └── IndiaMap.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── MapPage.jsx
│   │   │   ├── Destinations.jsx
│   │   │   ├── PlaceDetail.jsx
│   │   │   ├── TripPlanner.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── data/
│   │   │   └── places.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/
    ├── data/
    │   └── touristPlaces.js     ← 5000+ destinations dataset
    ├── models/
    │   └── index.js             ← User, Review, Trip, Place schemas
    ├── routes/
    │   ├── auth.js              ← Register, Login, Favorites
    │   ├── places.js            ← CRUD + filtering + stats
    │   ├── planner.js           ← AI trip generation
    │   ├── chatbot.js           ← NLP travel guide
    │   ├── reviews.js           ← User reviews
    │   ├── trips.js             ← Saved trips
    │   └── admin.js             ← Admin stats + user management
    ├── middleware/
    │   └── auth.js              ← JWT protect + adminOnly
    ├── server.js
    ├── package.json
    └── .env
```

---

## ⚙️ Prerequisites

Install these before starting:

1. **Node.js** (v18+) → https://nodejs.org
2. **MongoDB Community** (v6+) → https://www.mongodb.com/try/download/community
3. **VS Code** → https://code.visualstudio.com
4. **Git** (optional) → https://git-scm.com

---

## 🚀 Installation & Setup

### Step 1 — Open VS Code and the project folder

```bash
# Open VS Code in the project root
code bharat-explorer
```

### Step 2 — Setup the Backend

Open a **new terminal** in VS Code (`Ctrl + `` ` ``):

```bash
cd backend
npm install
```

Create the `.env` file (already included — just verify it):

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bharat-explorer
JWT_SECRET=bharatexplorer_super_secret_key_2024
NODE_ENV=development
```

### Step 3 — Start MongoDB

**Windows:**
```bash
# Start MongoDB service (if installed as service)
net start MongoDB

# OR run manually
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath C:\data\db
```

**macOS:**
```bash
brew services start mongodb-community
# OR
mongod --config /usr/local/etc/mongod.conf
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Step 4 — Start the Backend Server

```bash
# From the backend folder
npm run dev
# Server runs at http://localhost:5000
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

> **Note:** The backend works even without MongoDB connected. The 5000+ destinations are loaded from the JSON dataset file.

### Step 5 — Setup the Frontend

Open a **second terminal** in VS Code:

```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:3000
```

### Step 6 — Open the App

Navigate to: **http://localhost:3000**

---

## 🔑 API Endpoints Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |
| PUT | `/api/auth/favorites/:id` | Toggle favorite (protected) |

### Places
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/places` | Get all places (filterable) |
| GET | `/api/places/:id` | Get single place |
| GET | `/api/places/states` | List all states |
| GET | `/api/places/state/:name` | Places by state |
| GET | `/api/places/stats` | Statistics |
| POST | `/api/places` | Add place (admin) |
| PUT | `/api/places/:id` | Update place (admin) |
| DELETE | `/api/places/:id` | Delete place (admin) |

### Planner & Chatbot
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/planner/generate` | Generate AI itinerary |
| POST | `/api/chatbot` | Ask chatbot a question |

### Query Parameters for GET /api/places
```
?state=Rajasthan
?category=Temple
?search=taj+mahal
?page=1&limit=20
?sort=rating
```

---

## 🧪 Testing with Postman

### 1. Register a user
```json
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@bharat.com",
  "password": "password123"
}
```

### 2. Login
```json
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@bharat.com",
  "password": "password123"
}
```
Copy the `token` from the response.

### 3. Get places with filter
```
GET http://localhost:5000/api/places?state=Rajasthan&category=Fort&limit=5
```

### 4. Generate trip plan
```json
POST http://localhost:5000/api/planner/generate
Content-Type: application/json

{
  "city": "Jaipur",
  "days": 3,
  "budget": "medium",
  "interests": ["temples", "history", "food"]
}
```

### 5. Ask chatbot
```json
POST http://localhost:5000/api/chatbot
Content-Type: application/json

{
  "message": "Best places in Rajasthan"
}
```

---

## 👤 Default Admin Account

Create an admin account in MongoDB directly, or update a user's role:

**Option 1 — Using MongoDB Compass:**
1. Open MongoDB Compass → `bharat-explorer` DB → `users` collection
2. Find your user and change `role` from `"user"` to `"admin"`

**Option 2 — Using Mongo Shell:**
```bash
mongosh
use bharat-explorer
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

Then access `/admin` in the app.

---

## ✨ Features

| Feature | Status |
|---------|--------|
| 🗺️ Interactive SVG India Map | ✅ All 36 states/UTs clickable |
| 📍 5000+ Destinations | ✅ Full dataset with filters |
| 🔍 Search & Filter | ✅ By state, category, keyword |
| 🤖 AI Trip Planner | ✅ Day-wise itinerary + budget |
| 💬 AI Chatbot | ✅ NLP travel guide |
| 🔐 JWT Authentication | ✅ Register / Login / Logout |
| ❤️ Favorites System | ✅ Save places to profile |
| ⭐ Reviews | ✅ Rating + comments |
| 🗓️ Trip Saving | ✅ Save generated plans |
| ⚙️ Admin Dashboard | ✅ Stats, CRUD, user management |
| 📱 Mobile Responsive | ✅ All pages |
| 🌙 Dark Hero Sections | ✅ Premium design |

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy the dist/ folder to Vercel
```

Or via Vercel CLI:
```bash
npm i -g vercel
vercel --prod
```

### Backend → Render
1. Push to GitHub
2. Go to render.com → New Web Service
3. Set `Root Directory` = `backend`
4. Set `Build Command` = `npm install`
5. Set `Start Command` = `node server.js`
6. Add environment variables from `.env`

### Database → MongoDB Atlas
1. Create free cluster at mongodb.com/atlas
2. Get connection string
3. Replace `MONGO_URI` in `.env` and Render env vars:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bharat-explorer
```

---

## 🛠️ VS Code Extensions (Recommended)

- **ES7 React Snippets** — React shortcuts
- **Tailwind CSS IntelliSense** — Autocomplete for Tailwind
- **Thunder Client** — API testing inside VS Code
- **MongoDB for VS Code** — DB browsing
- **Prettier** — Code formatting

---

## 📝 Environment Variables Summary

```bash
# backend/.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bharat-explorer
JWT_SECRET=bharatexplorer_super_secret_key_2024
NODE_ENV=development
```

---

## 🐛 Troubleshooting

**Port 5000 already in use:**
```bash
# Find and kill the process
lsof -i :5000
kill -9 <PID>
# Or change PORT in .env
```

**MongoDB not connecting:**
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"
# The app still works without DB (uses JSON dataset)
```

**Frontend can't reach backend:**
- Make sure backend runs on port 5000
- Vite proxy in `vite.config.js` maps `/api` → `http://localhost:5000`

**Module not found errors:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

Built with ❤️ for Incredible India 🇮🇳
