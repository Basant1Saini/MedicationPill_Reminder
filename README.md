# MedicationPill Reminder

A full-stack Medication Pill Reminder application built with the MERN stack using the latest technologies.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | 19.x |
| Routing | React Router v7 | 7.x |
| State Management | Zustand | 5.x |
| Styling | Tailwind CSS v4 | 4.x |
| UI Components | shadcn/ui | latest |
| HTTP Client | Axios | 1.x |
| Form Handling | React Hook Form + Zod | latest |
| Backend | Node.js + Express | 5.x |
| Database | MongoDB + Mongoose | 8.x |
| Authentication | JWT + bcrypt | latest |
| Push Notifications | Web Push API + service worker | native |
| Email Notifications | Nodemailer + Gmail OAuth2 | latest |
| Scheduler | node-cron | 3.x |
| API Docs | Swagger (swagger-jsdoc) | latest |
| Testing | Vitest (frontend) + Jest (backend) | latest |
| Containerization | Docker + Docker Compose | latest |

---

## Project Structure

```
MedicationPill_Reminder/
├── client/                        # React frontend
│   ├── public/
│   │   └── sw.js                  # Service worker for push notifications
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/                # shadcn/ui components
│   │   │   ├── MedicationCard.jsx
│   │   │   ├── ReminderForm.jsx
│   │   │   ├── DoseHistory.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Medications.jsx
│   │   │   ├── Reminders.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── store/
│   │   │   ├── authStore.js       # Zustand auth state
│   │   │   ├── medicationStore.js
│   │   │   └── reminderStore.js
│   │   ├── hooks/
│   │   │   ├── useMedications.js
│   │   │   └── useReminders.js
│   │   ├── lib/
│   │   │   ├── axios.js           # Axios instance with interceptors
│   │   │   └── utils.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                        # Express backend
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── medicationController.js
│   │   ├── reminderController.js
│   │   └── doseController.js
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verify
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Medication.js
│   │   ├── Reminder.js
│   │   └── DoseLog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── medicationRoutes.js
│   │   ├── reminderRoutes.js
│   │   └── doseRoutes.js
│   ├── services/
│   │   ├── notificationService.js # node-cron + Web Push
│   │   └── emailService.js        # Nodemailer
│   ├── utils/
│   │   └── generateToken.js
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## Database Schema

### User
```js
{
  name: String,
  email: { type: String, unique: true },
  password: String,                  // bcrypt hashed
  pushSubscription: Object,          // Web Push subscription object
  createdAt: Date
}
```

### Medication
```js
{
  userId: ObjectId,
  name: String,
  dosage: String,                    // e.g. "500mg"
  form: String,                      // tablet | capsule | liquid | injection
  stock: Number,                     // remaining pills count
  refillAlert: Number,               // alert when stock <= this value
  notes: String,
  createdAt: Date
}
```

### Reminder
```js
{
  userId: ObjectId,
  medicationId: ObjectId,
  times: [String],                   // ["08:00", "14:00", "20:00"]
  days: [String],                    // ["Mon","Tue",...] or ["daily"]
  startDate: Date,
  endDate: Date,
  isActive: Boolean,
  notifyVia: [String]                // ["push", "email"]
}
```

### DoseLog
```js
{
  userId: ObjectId,
  medicationId: ObjectId,
  reminderId: ObjectId,
  scheduledAt: Date,
  takenAt: Date,
  status: String                     // taken | missed | snoozed
}
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |

### Medications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medications` | List all medications |
| POST | `/api/medications` | Add medication |
| PUT | `/api/medications/:id` | Update medication |
| DELETE | `/api/medications/:id` | Delete medication |

### Reminders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reminders` | List all reminders |
| POST | `/api/reminders` | Create reminder |
| PUT | `/api/reminders/:id` | Update reminder |
| DELETE | `/api/reminders/:id` | Delete reminder |
| PATCH | `/api/reminders/:id/toggle` | Enable/disable reminder |

### Dose Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doses` | Get dose history |
| POST | `/api/doses/log` | Log a dose (taken/missed/snoozed) |
| GET | `/api/doses/stats` | Adherence stats |

### Push Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notifications/subscribe` | Save push subscription |
| DELETE | `/api/notifications/unsubscribe` | Remove subscription |

---

## Core Features

1. **User Authentication** — Register/Login with JWT (httpOnly cookie), bcrypt password hashing
2. **Medication Management** — Add, edit, delete medications with stock tracking and refill alerts
3. **Smart Reminders** — Schedule reminders by time and day with start/end dates
4. **Push Notifications** — Browser push via Web Push API + service worker (no third-party service)
5. **Email Notifications** — Nodemailer with Gmail OAuth2 (no deprecated username/password auth)
6. **Dose Logging** — Mark doses as taken, missed, or snoozed
7. **Adherence Dashboard** — Visual stats: adherence %, streak, missed doses chart
8. **Refill Alerts** — Auto-decrement stock on dose taken, alert when low
9. **Responsive UI** — Mobile-first with Tailwind CSS v4 + shadcn/ui

---

## Implementation Plan

### Phase 1 — Project Setup
- [ ] Initialize monorepo with `client/` (Vite + React 19) and `server/` (Express 5)
- [ ] Configure ESLint + Prettier for both
- [ ] Set up Docker Compose with MongoDB service
- [ ] Configure environment variables (`.env`)

### Phase 2 — Backend Core
- [ ] MongoDB connection with Mongoose 8
- [ ] User model + auth routes (register, login, JWT via httpOnly cookie)
- [ ] Medication CRUD routes + controller
- [ ] Reminder CRUD routes + controller
- [ ] Dose log routes + controller
- [ ] Global error handler middleware

### Phase 3 — Notification System
- [ ] Register service worker in client (`sw.js`)
- [ ] Web Push subscription save/delete API
- [ ] `node-cron` job: every minute check due reminders → send push
- [ ] Nodemailer + Gmail OAuth2 email service
- [ ] Refill alert trigger when stock hits threshold

### Phase 4 — Frontend
- [ ] Zustand stores: auth, medications, reminders
- [ ] Axios instance with JWT interceptor (auto-refresh on 401)
- [ ] Pages: Dashboard, Medications, Reminders, History, Login, Register
- [ ] React Hook Form + Zod validation on all forms
- [ ] Adherence stats chart (Recharts)
- [ ] Service worker registration + push permission request

### Phase 5 — Testing & Docs
- [ ] Vitest unit tests for frontend components and stores
- [ ] Jest + Supertest integration tests for API routes
- [ ] Swagger docs via `swagger-jsdoc` + `swagger-ui-express`

### Phase 6 — Deployment
- [ ] Dockerize client and server
- [ ] Docker Compose for local full-stack run
- [ ] Deploy backend to AWS EC2 / Render
- [ ] Deploy frontend to Vercel / AWS Amplify
- [ ] MongoDB Atlas for production database

---

## Environment Variables

### server/.env
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pill_reminder
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=7d
VAPID_PUBLIC_KEY=<vapid_public_key>
VAPID_PRIVATE_KEY=<vapid_private_key>
GMAIL_CLIENT_ID=<gmail_oauth2_client_id>
GMAIL_CLIENT_SECRET=<gmail_oauth2_client_secret>
GMAIL_REFRESH_TOKEN=<gmail_oauth2_refresh_token>
GMAIL_USER=<your_gmail_address>
```

### client/.env
```env
VITE_API_URL=http://localhost:5000/api
VITE_VAPID_PUBLIC_KEY=<vapid_public_key>
```

---

## Getting Started

```bash
# Clone the repo
git clone <repo-url>
cd MedicationPill_Reminder

# Start MongoDB via Docker
docker-compose up -d mongo

# Backend
cd server && npm install && npm run dev

# Frontend
cd client && npm install && npm run dev
```

---

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| `server/` | `npm run dev` | Start server with nodemon |
| `server/` | `npm test` | Run Jest tests |
| `client/` | `npm run dev` | Start Vite dev server |
| `client/` | `npm run build` | Production build |
| `client/` | `npm test` | Run Vitest |
| root | `docker-compose up` | Start full stack |
