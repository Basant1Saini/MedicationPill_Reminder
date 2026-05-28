# MedicationPill Reminder

A full-stack Medication Pill Reminder application built with the MERN stack using the latest non-deprecated technologies.

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
| Authentication | JWT + bcryptjs | latest |
| Push Notifications | Web Push API + service worker | native |
| Email Notifications | Nodemailer v8 + Gmail OAuth2 | 8.x |
| Scheduler | node-cron | 4.x |
| API Docs | Swagger (swagger-jsdoc + swagger-ui-express) | latest |
| Testing | Vitest (frontend) + Jest + Supertest (backend) | latest |
| Containerization | Docker + Docker Compose | latest |

> All packages are pinned to non-deprecated, vulnerability-free versions. `npm audit` reports **0 vulnerabilities**.

---

## Project Structure

```
MedicationPill_Reminder/
├── .gitignore
├── README.md
│
├── server/                          # ✅ Complete — Express 5 backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection (Mongoose 8)
│   ├── controllers/
│   │   ├── authController.js        # register, login, logout, getMe
│   │   ├── medicationController.js  # CRUD
│   │   ├── reminderController.js    # CRUD + toggle
│   │   └── doseController.js        # log dose, history, adherence stats
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verify via httpOnly cookie
│   │   └── errorHandler.js          # global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Medication.js
│   │   ├── Reminder.js
│   │   └── DoseLog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── medicationRoutes.js
│   │   ├── reminderRoutes.js
│   │   ├── doseRoutes.js
│   │   └── notificationRoutes.js    # push subscribe/unsubscribe
│   ├── services/
│   │   ├── notificationService.js   # node-cron v4 + web-push
│   │   └── emailService.js          # Nodemailer v8 + Gmail OAuth2
│   ├── utils/
│   │   └── generateToken.js         # JWT + httpOnly cookie
│   ├── app.js                       # Express app, routes, Swagger
│   ├── server.js                    # Entry point, DB connect, cron start
│   ├── .env                         # Environment variables (not committed)
│   └── package.json
│
└── client/                          # 🔲 Pending — React 19 frontend
    ├── public/
    │   └── sw.js                    # Service worker for push notifications
    ├── src/
    │   ├── components/
    │   │   ├── ui/                  # shadcn/ui components
    │   │   ├── MedicationCard.jsx
    │   │   ├── ReminderForm.jsx
    │   │   ├── DoseHistory.jsx
    │   │   └── Navbar.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Medications.jsx
    │   │   ├── Reminders.jsx
    │   │   ├── History.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── store/
    │   │   ├── authStore.js
    │   │   ├── medicationStore.js
    │   │   └── reminderStore.js
    │   ├── hooks/
    │   │   ├── useMedications.js
    │   │   └── useReminders.js
    │   ├── lib/
    │   │   ├── axios.js             # Axios instance with interceptors
    │   │   └── utils.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Database Schema

### User
```js
{
  name: String,
  email: { type: String, unique: true },
  password: String,           // bcryptjs hashed (12 rounds)
  pushSubscription: Object,   // Web Push subscription object
  createdAt: Date
}
```

### Medication
```js
{
  userId: ObjectId,
  name: String,
  dosage: String,             // e.g. "500mg"
  form: String,               // tablet | capsule | liquid | injection
  stock: Number,              // remaining pills count
  refillAlert: Number,        // alert when stock <= this value
  notes: String,
  createdAt: Date
}
```

### Reminder
```js
{
  userId: ObjectId,
  medicationId: ObjectId,
  times: [String],            // ["08:00", "14:00", "20:00"]
  days: [String],             // ["Mon","Tue",...] or ["daily"]
  startDate: Date,
  endDate: Date,
  isActive: Boolean,
  notifyVia: [String]         // ["push", "email"]
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
  status: String              // taken | missed | snoozed
}
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login, sets JWT httpOnly cookie |
| POST | `/api/auth/logout` | Clear JWT cookie |
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
| GET | `/api/doses` | Get dose history (last 100) |
| POST | `/api/doses/log` | Log a dose (taken/missed/snoozed) |
| GET | `/api/doses/stats` | Adherence stats (total, taken, missed, %) |

### Push Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notifications/subscribe` | Save push subscription |
| DELETE | `/api/notifications/unsubscribe` | Remove subscription |

### API Docs
| URL | Description |
|-----|-------------|
| `GET /api/docs` | Swagger UI (auto-generated from JSDoc) |

---

## Core Features

1. **User Authentication** — Register/Login with JWT stored in httpOnly cookie, bcryptjs password hashing (12 rounds)
2. **Medication Management** — Add, edit, delete medications with stock tracking and refill alerts
3. **Smart Reminders** — Schedule reminders by time and day with start/end dates, enable/disable toggle
4. **Push Notifications** — Browser push via Web Push API + service worker (no third-party service, VAPID keys)
5. **Email Notifications** — Nodemailer v8 with Gmail OAuth2 (no deprecated username/password auth)
6. **Dose Logging** — Mark doses as taken, missed, or snoozed; auto-decrements stock on taken
7. **Adherence Stats** — Adherence %, total/taken/missed counts via `/api/doses/stats`
8. **Refill Alerts** — Email alert when stock hits the refill threshold
9. **Cron Scheduler** — node-cron v4 checks due reminders every minute and fires push + email
10. **Swagger Docs** — Auto-generated API docs at `/api/docs`
11. **Responsive UI** — Mobile-first with Tailwind CSS v4 + shadcn/ui *(client pending)*

---

## Deprecated Package Fixes

The following packages were identified as deprecated/vulnerable and updated:

| Package | Old Version | New Version | Reason |
|---------|------------|-------------|--------|
| `nodemailer` | 6.9.16 | **8.0.9** | Fixed SMTP injection CVEs (high), DoS, address parser vuln |
| `node-cron` | 3.0.3 | **4.2.1** | Fixed uuid vulnerability (moderate); breaking: named export |
| `googleapis` | 144.x | **172.0.0** | Fixed uuid vuln in gaxios/googleapis-common |

**Breaking change adaptations:**
- `nodemailer@8` — removed manual `googleapis` OAuth2 `getAccessToken()` wrapper; v8 handles OAuth2 natively in the transport config
- `node-cron@4` — changed `import cron from 'node-cron'` → `import { schedule } from 'node-cron'` (no default export)

---

## Implementation Progress

### Phase 1 — Project Setup
- [x] Initialize `server/` (Express 5, ESM)
- [x] Configure `.gitignore` (node_modules, .env, dist)
- [ ] Initialize `client/` (Vite + React 19)
- [ ] Docker Compose with MongoDB service

### Phase 2 — Backend Core ✅
- [x] MongoDB connection with Mongoose 8
- [x] User model + auth routes (register, login, logout, JWT via httpOnly cookie)
- [x] Medication CRUD routes + controller
- [x] Reminder CRUD routes + controller (with toggle)
- [x] Dose log routes + controller (log, history, stats)
- [x] Global error handler middleware
- [x] JWT auth middleware

### Phase 3 — Notification System ✅
- [x] Web Push subscription save/delete API
- [x] node-cron v4 job: every minute check due reminders → send push
- [x] Nodemailer v8 + Gmail OAuth2 email service
- [x] Refill alert trigger when stock hits threshold
- [ ] Register service worker in client (`sw.js`)

### Phase 4 — Frontend 🔲
- [ ] Zustand stores: auth, medications, reminders
- [ ] Axios instance with JWT interceptor
- [ ] Pages: Dashboard, Medications, Reminders, History, Login, Register
- [ ] React Hook Form + Zod validation on all forms
- [ ] Adherence stats chart (Recharts)
- [ ] Service worker registration + push permission request

### Phase 5 — Testing & Docs 🔲
- [ ] Vitest unit tests for frontend components and stores
- [ ] Jest + Supertest integration tests for API routes
- [x] Swagger docs via `swagger-jsdoc` + `swagger-ui-express`

### Phase 6 — Deployment 🔲
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
MONGO_URI=mongodb://mongo:27017/pill_reminder
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=7d
VAPID_PUBLIC_KEY=<vapid_public_key>
VAPID_PRIVATE_KEY=<vapid_private_key>
GMAIL_CLIENT_ID=<gmail_oauth2_client_id>
GMAIL_CLIENT_SECRET=<gmail_oauth2_client_secret>
GMAIL_REFRESH_TOKEN=<gmail_oauth2_refresh_token>
GMAIL_USER=<your_gmail_address>
CLIENT_URL=http://localhost:5173
```

### client/.env *(pending)*
```env
VITE_API_URL=http://localhost:5000/api
VITE_VAPID_PUBLIC_KEY=<vapid_public_key>
```

> Generate VAPID keys with: `npx web-push generate-vapid-keys`

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Basant1Saini/MedicationPill_Reminder.git
cd MedicationPill_Reminder

# Backend
cd server
cp .env.example .env   # fill in your values
npm install
npm run dev            # starts on http://localhost:5000

# API Docs available at:
# http://localhost:5000/api/docs
```

---

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| `server/` | `npm run dev` | Start server with nodemon |
| `server/` | `npm start` | Start server (production) |
| `server/` | `npm test` | Run Jest tests |
| `client/` | `npm run dev` | Start Vite dev server *(pending)* |
| `client/` | `npm run build` | Production build *(pending)* |
| `client/` | `npm test` | Run Vitest *(pending)* |
| root | `docker-compose up` | Start full stack *(pending)* |
