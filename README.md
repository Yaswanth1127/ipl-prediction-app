# IPL Prediction App

Production-style IPL prediction website for a friends league, with separate user and admin portals.

## Features

- Email/password signup and login
- Google sign-in support
- Role-based access for `user` and `admin`
- Prediction editing until the configured deadline
- Admin deadline override for delays or rain
- Admin result posting with automatic leaderboard recalculation
- User prediction history and leaderboard view

## Tech Stack

- Frontend: React + Vite + React Router + Axios
- Backend: Express + MongoDB + Mongoose + JWT

## Project Structure

- `frontend`: React application
- `backend`: Express API and MongoDB models

## Environment Setup

### Backend

1. Copy [backend/.env.example](/C:/Users/yaswanth/Desktop/ipl-prediction-app/backend/.env.example) to `backend/.env`.
2. Set:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `GOOGLE_CLIENT_ID`
   - `ADMIN_NAME`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`

### Frontend

1. Copy [frontend/.env.example](/C:/Users/yaswanth/Desktop/ipl-prediction-app/frontend/.env.example) to `frontend/.env`.
2. Set:
   - `VITE_API_BASE_URL`
   - `VITE_GOOGLE_CLIENT_ID`

## Local Development

1. Install dependencies:

```bash
npm run install:all
```

2. Seed matches:

```bash
npm run seed:matches
```

3. Seed the initial admin:

```bash
npm run seed:admin
```

4. Start the backend:

```bash
npm run dev:backend
```

5. Start the frontend in a second terminal:

```bash
npm run dev:frontend
```

## Google Sign-In

- Create a Google OAuth web client in Google Cloud.
- Add `http://localhost:5173` as an authorized JavaScript origin.
- Put the same client ID in both backend and frontend env files.

## Useful Commands

```bash
npm run test:backend
npm run build:frontend
```

## Core API Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/auth/me`
- `GET /api/matches`
- `GET /api/matches/:id`
- `PUT /api/predictions/:matchId`
- `GET /api/predictions/me`
- `GET /api/leaderboard`
- `GET /api/admin/matches`
- `PATCH /api/admin/matches/:id/deadline`
- `PATCH /api/admin/matches/:id/result`
- `GET /api/admin/predictions/:matchId`
