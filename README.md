# Student–Faculty Doubt Resolution Portal

A full MERN stack app (MongoDB, Express, React, Node) where **students** post doubts
via text, and **faculty** see them and reply with solutions.

## Features
- Separate Student / Faculty login & registration (role stored on the user, checked on login)
- JWT-based authentication
- Students: post a doubt (subject, title, details), see their own doubts and any replies
- Faculty: see all doubts from all students, filter by open/resolved, reply to any doubt
- A doubt auto-flips to "resolved" once faculty replies
- Dashboards auto-refresh every 10s so replies/new doubts show up without a manual refresh

## Tech
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- **Frontend:** React (Vite), React Router, Axios

## Project structure
```
doubt-portal/
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/User.js
│   ├── models/Doubt.js
│   ├── routes/auth.js
│   ├── routes/doubts.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.jsx
    │   ├── components/ (Navbar, ProtectedRoute, DoubtThread)
    │   ├── pages/ (Login, Register, StudentDashboard, FacultyDashboard)
    │   ├── App.jsx, main.jsx, index.css
    ├── index.html
    ├── package.json
    └── .env.example
```

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string

### Environment variables
Keep all secrets and environment-specific values in local `.env` files. Do not commit them to Git.

#### Backend: `backend/.env`
```env
MONGO_URI=mongodb://127.0.0.1:27017/doubt-portal
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
JWT_EXPIRES_IN=7d
```
- `MONGO_URI` is used by the database connection in `backend/config/db.js`
- `JWT_SECRET` is used for signing and verifying tokens in `backend/middleware/auth.js` and `backend/routes/auth.js`
- `CLIENT_ORIGIN` is used by CORS in `backend/server.js`
- `PORT` controls the API server port

#### Frontend: `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
```
- `VITE_API_URL` is read by `frontend/src/api/axios.js` and used as the base URL for all API calls

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env if needed
npm run dev      # or: npm start
```
Backend runs on `http://localhost:5000` by default.

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env
# edit VITE_API_URL if your backend runs elsewhere
npm run dev
```
Frontend runs on `http://localhost:5173` by default.

### 3. Use it
1. Open `http://localhost:5173`
2. Register once as a **student**, register once as a **faculty** (use different emails)
3. Log in as the student → post a doubt
4. Log in as faculty (different browser / incognito tab, or logout+login) → see the doubt, reply
5. Switch back to the student tab (or wait ~10s) → the reply appears

## API Overview
| Method | Route                    | Access         | Description                     |
|--------|---------------------------|----------------|----------------------------------|
| POST   | /api/auth/register        | Public         | Register as student or faculty  |
| POST   | /api/auth/login           | Public         | Login (role must match account) |
| GET    | /api/doubts                | Logged in      | Student: own doubts. Faculty: all |
| POST   | /api/doubts                | Student only   | Ask a new doubt                 |
| GET    | /api/doubts/:id            | Logged in      | Get single doubt                |
| POST   | /api/doubts/:id/reply      | Faculty only   | Reply to a doubt (marks resolved)|
| PATCH  | /api/doubts/:id/status     | Faculty only   | Manually set status              |

## Notes / possible extensions
- Add real-time updates with Socket.IO instead of polling
- Add file/image attachments to doubts
- Add pagination/search on the faculty dashboard for large doubt volumes
- Add email notifications when a doubt is answered
