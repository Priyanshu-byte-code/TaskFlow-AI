# TaskFlow

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Socket.io](https://img.shields.io/badge/Socket.io-4.7-black?logo=socket.io)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

A full-stack AI-powered project management SaaS built with the MERN stack. Features real-time collaboration, role-based access control, drag-and-drop Kanban, and an OpenAI-powered sprint assistant.

**[Live Demo](https://taskflow.vercel.app)** · **[Backend API](https://taskflow-api.onrender.com/api/health)**

---

## Features

- JWT authentication with refresh token rotation (httpOnly cookies)
- Role-based access control — Admin / Manager / Member
- Real-time task sync via Socket.io (no page refresh needed)
- Drag-and-drop Kanban board across 4 sprint columns
- AI sprint assistant powered by OpenAI GPT-3.5
- Recharts analytics dashboard
- In-app notification system

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| State | Redux Toolkit |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs + httpOnly cookies |
| Real-time | Socket.io |
| AI | Grok API |
| Charts | Recharts |
| Deployment | Vercel + Render + MongoDB Atlas |

---

## Local Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET, OPENAI_API_KEY
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
# VITE_SOCKET_URL=http://localhost:5000
npm run dev
```

App runs at `http://localhost:5173`

---

## Deployment

- **MongoDB**: MongoDB Atlas (free M0 cluster)
- **Backend**: Render (free tier) — set all env vars in dashboard
- **Frontend**: Vercel — set VITE_API_URL and VITE_SOCKET_URL to your Render URL

---

## License
MIT
