# DONATO

DONATO is a production-style MVP donation platform for streamers with clean architecture and real-time donation updates.

## One Click Run (No Setup)

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

## Local Run

Full-stack mode (client + server) is still available.

From repository root:

1. Install dependencies

npm install

2. Seed sample data

npm run seed

3. Start both frontend and backend

npm run dev

Frontend: http://localhost:5173
Backend: http://localhost:5000

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
