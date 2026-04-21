# DONATO

DONATO is a production-style MVP donation platform for streamers with clean architecture and real-time donation updates.

## Full-Stack Run (Real Website)

This is the primary mode. It runs React + Express + MongoDB with real API calls, JWT auth, and Socket.io updates.

From repository root:

1. Install dependencies

npm install

2. Create env files

- Copy server/.env.example to server/.env
- Copy client/.env.example to client/.env

3. Start MongoDB locally (or update MONGODB_URI in server/.env)

4. Seed sample data

npm run seed

5. Start frontend and backend together

npm run dev

6. Open the website

- Frontend: http://localhost:5173
- Backend health: http://localhost:5000/health

For production-like local run (backend serving built frontend):

npm run start:prod

## Deploy to Vercel (Real Website)

This repository is configured to deploy as a single Vercel project:

- Frontend: built from client (Vite output)
- Backend API: serverless handler at api/[...all].js

### 1) Import repository

1. Open Vercel dashboard.
2. Import repository swagat918/donato.
3. Keep project root as repository root.

### 2) Configure environment variables in Vercel

Set these variables in Vercel Project Settings -> Environment Variables:

- NODE_ENV=production
- PORT=5000
- MONGODB_URI=your-mongodb-atlas-uri
- CLIENT_URL=https://your-project.vercel.app
- COOKIE_NAME=donato_token
- COOKIE_SAME_SITE=none
- COOKIE_SECURE=true
- JWT_SECRET=your-strong-secret
- JWT_EXPIRES_IN=7d
- PLATFORM_COMMISSION_RATE=5
- DEFAULT_PAYMENT_PROVIDER=mock

Optional Google OAuth variables:

- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_CALLBACK_URL=https://your-project.vercel.app/api/auth/google/callback

### 3) Deploy

Deploy normally from Vercel. The repository includes vercel.json so routes and API mapping are preconfigured.

### 4) Post-deploy checks

1. Open https://your-project.vercel.app
2. Verify API health: https://your-project.vercel.app/api/health
3. Register/login and test donation flow

### Real-time note on Vercel

Socket.io long-lived realtime is limited on serverless platforms. The streamer dashboard in this repo automatically falls back to periodic polling in deployed mode, so donation feed still updates without manual refresh.

## Optional Static Preview

Use this if you want a github.io style experience with no Node, no MongoDB, and no install steps.

1. Open [index.html](index.html) directly in your browser.
2. Or publish this repository on GitHub Pages and open the root URL.

What this mode includes:

- Login and register
- Streamer list
- Donation flow with payment method selection
- User dashboard and streamer dashboard
- Instant live-feed style updates
- Browser localStorage persistence

Notes:

- This mode is static and does not need backend APIs.
- Use the Reset Demo Data button to reseed default demo users.

## Stack

- Frontend: React (Vite), Tailwind CSS, React Router
- Backend: Node.js, Express, MongoDB, Mongoose, Socket.io
- Auth: JWT (httpOnly cookie), Google OAuth (Passport), phone/email + password
- Payments: Payment service abstraction with providers for eSewa, Khalti, and Mock

## Project Structure

- client: React frontend
- server: Express backend

## Core Features Implemented

- Auth
  - Register with phone/email + password
  - Login with phone/email + password
  - Google OAuth flow via Passport (enabled when credentials exist)
  - Session handling with JWT in httpOnly cookie
  - Protected routes middleware
- Streamers
  - Streamer list page
  - Streamer profile page
  - Streamer dashboard with live feed
- Donations
  - Donation creation with amount, message, payment method
  - Pending to success/failed status transition
  - Platform commission calculation (configurable, default 5%)
  - Donation history for users and streamers
  - Summary endpoint for totals
- Real-time
  - Socket.io room per streamer
  - newDonation event emitted on successful donation

## API Routes

### Auth

- POST /auth/register
- POST /auth/login
- GET /auth/google
- GET /auth/google/callback
- GET /auth/me
- POST /auth/logout

### Streamers

- GET /streamers
- GET /streamers/:id

### Donations

- POST /donations
- GET /donations/user
- GET /donations/streamer/:id
- GET /donations/summary

## Environment Setup

### 1) Backend env

Copy server/.env.example to server/.env and update values:

- PORT
- MONGODB_URI
- CLIENT_URL
- COOKIE_NAME
- COOKIE_SAME_SITE
- COOKIE_SECURE
- JWT_SECRET
- JWT_EXPIRES_IN
- PLATFORM_COMMISSION_RATE
- DEFAULT_PAYMENT_PROVIDER
- GOOGLE_CLIENT_ID (optional but required for Google login)
- GOOGLE_CLIENT_SECRET (optional but required for Google login)
- GOOGLE_CALLBACK_URL (optional but required for Google login)

### 2) Frontend env

Copy client/.env.example to client/.env and update values:

- VITE_API_URL
- VITE_SOCKET_URL
- VITE_GOOGLE_AUTH_URL

## Local Run Notes

- `npm run dev` runs client and server separately for development.
- `npm run start:prod` builds the client and serves it from the backend in production mode.

## Seed Data

Seed script creates:

- One donor user
- One streamer user
- One streamer profile
- One successful donation

Sample credentials:

- Donor: donor@donato.local / password123
- Streamer: streamer@donato.local / password123

## Payment Abstraction Design

Payment flow goes through service layer only:

- paymentService.processPayment()
- Providers:
  - EsewaProvider (mock provider structure)
  - KhaltiProvider (mock provider structure)
  - MockProvider (default local behavior)

No payment business logic is hardcoded inside routes.

## Real-time Event

- Event: newDonation
- Room: streamer:{streamerId}
- Emitted after donation status changes to success

Payload includes:

- donationId
- streamerId
- donorName
- amount
- message
- timestamp
- totalEarnings

## Notes on Google OAuth

Google OAuth route is fully implemented using Passport. If Google credentials are not configured in backend env, the server still runs and returns a clear 503 response for OAuth routes.

## Architecture Rules Applied

- No business logic in routes
- Layered backend modules:
  - controllers
  - services
  - models
  - routes
  - middleware
  - sockets
  - payment providers
- Environment-driven configuration
- Modular frontend feature pages and shared services
