# AI Health Record Translator

An AI-powered web application that turns confusing medical reports (PDF or image) into
plain-language summaries — with translation into regional Indian languages and a
downloadable PDF. Built for education, not diagnosis.

> ⚠️ **Medical Disclaimer**: This application is for **educational purposes only**.
> It does not diagnose, treat, or provide medical advice. Always consult a qualified
> doctor for interpretation of your health records and before making any medical decisions.

---

## Features

- 🔐 **Secure authentication** — JWT-based register/login with bcrypt password hashing
- 📤 **File upload** — PDF, JPG, and PNG reports, stored on Cloudinary
- 🔎 **OCR extraction** — text pulled from images and PDFs automatically
- 🤖 **AI-powered summaries** — Gemini AI explains findings in plain English, flags
  abnormal values, suggests questions to ask your doctor, and always includes a
  medical disclaimer (never a diagnosis)
- 🌐 **Multi-language translation** — English, Hindi, Marathi, Tamil, Kannada, Telugu
  (medical terms preserved)
- 📄 **PDF export** — download a hospital-style formatted summary
- 🗂 **History** — view, search, and delete previously uploaded reports
- 🎨 **Polished UI** — responsive dashboard, loading states, toast notifications

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT, bcrypt |
| OCR | Tesseract.js, pdf-parse |
| AI / Translation | Google Gemini API |
| File Upload | Multer |
| File Storage | Cloudinary |
| PDF Generation | jsPDF, html2canvas |
| Deployment | Vercel (frontend) · Render (backend) · MongoDB Atlas · Cloudinary |

---

## Folder Structure

```
Ai_Health-Record_Translator/
├── backend/
│   ├── src/
│   │   ├── config/          # db.js, cloudinary.js
│   │   ├── controllers/     # authController.js, reportController.js
│   │   ├── middlewares/     # authMiddleware.js, uploadMiddleware.js
│   │   ├── models/          # User.js, Report.js
│   │   ├── routes/          # authRoutes.js, reportRoutes.js
│   │   ├── services/        # geminiService.js, ocrService.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/              # axios.js
│   │   ├── components/       # dashboard/, layout/, ProtectedRoute.jsx
│   │   ├── context/          # AuthContext.jsx
│   │   ├── pages/            # Login, Register, Dashboard, Upload, History, ReportDetail
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
├── render.yaml
└── README.md
```

---

## Installation

### Prerequisites
- Node.js 18+
- A MongoDB Atlas account & cluster
- A Cloudinary account
- A Google Gemini API key

### Clone
```bash
git clone https://github.com/<your-username>/ai-health-record-translator.git
cd ai-health-record-translator
```

### Backend setup
```bash
cd backend
npm install
cp .env.example .env
# then fill in the real values in .env (see Environment Variables below)
```

### Frontend setup
```bash
cd ../frontend
npm install
cp .env.example .env
# VITE_API_URL should point at your backend (default: http://localhost:5000)
```

---

## Running Locally

**Backend** (from `/backend`):
```bash
npm run dev
# Server running on port 5000
```

**Frontend** (from `/frontend`, separate terminal):
```bash
npm run dev
# Vite dev server on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## Environment Variables

### `backend/.env`
| Variable | Description |
|---|---|
| `PORT` | Backend server port (default `5000`) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `GEMINI_API_KEY` | Google Gemini API key |
| `FRONTEND_URL` | Deployed frontend URL (used to whitelist CORS in production) |

### `frontend/.env`
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

> 🔒 Never commit `.env` files. Only `.env.example` (placeholder values) is tracked in git.

---

## Deployment

| Service | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) — root directory `frontend` |
| Backend | [Render](https://render.com) — root directory `backend`, config in `render.yaml` |
| Database | MongoDB Atlas — whitelist `0.0.0.0/0` under Network Access |
| File Storage | Cloudinary |

**Steps:**
1. Push the repo to GitHub.
2. Deploy `backend` to Render, add all env vars from the table above (except `FRONTEND_URL`, added after step 3).
3. Deploy `frontend` to Vercel, set `VITE_API_URL` to your Render URL.
4. Back on Render, set `FRONTEND_URL` to your Vercel URL and redeploy so CORS accepts it.

Full step-by-step instructions, testing checklist, and a troubleshooting table are in the
project's Phase 11 notes (deployment configuration is already committed via `render.yaml`
and `frontend/vercel.json`).

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in and receive a JWT |
| GET | `/api/auth/me` | Private | Get the logged-in user's profile |

### Reports (`/api/reports`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/reports` | Private | List all reports for the logged-in user |
| POST | `/api/reports/upload` | Private | Upload a report (PDF/image); runs OCR + Gemini summary |
| GET | `/api/reports/:id` | Private | Get a single report's details |
| DELETE | `/api/reports/:id` | Private | Delete a report |
| POST | `/api/reports/:id/translate` | Private | Translate a report's summary into a selected language |

All `Private` routes require an `Authorization: Bearer <token>` header.

---

## Future Improvements

- [ ] Email verification & password reset flow
- [ ] Multi-file batch upload
- [ ] Support for additional regional languages
- [ ] Doctor-shareable report links with expiring access
- [ ] Admin dashboard for usage analytics
- [ ] Automated tests (unit + integration) and CI pipeline
- [ ] Rate limiting on AI endpoints to control API costs

---

## Screenshots

> _Add screenshots here once the app is deployed._

| Login | Dashboard | Report Summary |
|---|---|---|
| `screenshots/login.png` | `screenshots/dashboard.png` | `screenshots/report.png` |

---

## License

This project is for educational purposes. Not intended for clinical or diagnostic use.
