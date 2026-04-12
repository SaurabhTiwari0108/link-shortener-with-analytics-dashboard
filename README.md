# Full-Stack URL Shortener with Analytics

A modern, full-stack URL shortening service similar to Bitly. Built with React (Vite), Node.js, Express, and MongoDB. It features a clean glassmorphism UI, detailed analytics with Chart.js, device/location tracking, and QR code generation.

## Project Structure

- `/frontend` - React application (Vite)
- `/backend` - Node.js & Express REST API

## Prerequisites
- Node.js (v16+)
- A MongoDB cluster (e.g. MongoDB Atlas)

## Running Locally

### 1. Setup Database
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
- Get your connection string (URI).

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies (already installed if you ran the setup script):
   ```bash
   npm install
   ```
3. Create a `.env` file in the `/backend` directory and add the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```

### 3. Frontend Setup
1. Open a separate terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the URL provided by Vite (usually `http://localhost:5173`).

---

## Deployment Instructions

### Backend (Render or Railway)
1. Push your code to a GitHub repository.
2. Sign up on [Render](https://render.com/) or [Railway](https://railway.app/).
3. Create a new "Web Service" and connect your GitHub repo.
4. Set the Root Directory to `backend` (if supported) or customize the build/start commands:
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add your Environment Variables (`MONGODB_URI` and `JWT_SECRET`) in the deployment dashboard.
6. Deploy the service and copy the live backend URL.

### Frontend (Vercel)
1. Once your backend is deployed, go to `frontend/src/context/AuthContext.jsx` and `frontend/src/pages/Dashboard.jsx` (and Analytics.jsx) and update the axios `baseURL` and redirect URLs from `http://localhost:5000` to your live backend URL.
2. Sign up on [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository.
4. Set the Framework Preset to `Vite`.
5. Set the Root Directory to `frontend`.
6. Click Deploy. Your frontend will now be live and connected to your backend.

## Features
- **Authentication**: Secure JWT-based Login and Signup.
- **Shortening**: Paste long URLs and get short codes, with optional custom aliases.
- **Analytics Dashboard**: Line charts (clicks over time) and Doughnut charts (Device & Location) powered by Chart.js.
- **Location Tracking**: Uses IP geolocation to determine visitor country.
- **QR Codes**: Automatically generated QR codes for every shortened link.
- **Theming**: Dark and Light mode toggle.
- **Modern UI**: Clean, glassmorphism design approach.
