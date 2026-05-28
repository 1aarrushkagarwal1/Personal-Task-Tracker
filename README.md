# ⚡ Premium Personal Task Tracker

Welcome to your beautiful, premium, full-stack **Personal Task Tracker**. This application is structured with a modular FastAPI backend and an interactive, modern, dark-mode-first vanilla HTML/CSS/JS frontend.

It satisfies all **Day 2 tasks** of your evaluation week by establishing a clean project structure, implementing fully functional CRUD endpoints in FastAPI, and scaffolding a visually stunning user interface with micro-animations.

---

## 🎨 Features

- **Modern Dashboard UI:** A slate-indigo dark mode theme featuring modern glassmorphism (`backdrop-filter`) and smooth transitions.
- **Dynamic Stats Board:** Instant, automatic counts for **Total**, **Pending**, and **Completed** tasks.
- **Rich Task Actions:**
  - Create tasks with custom priority tiers (**High**, **Medium**, **Low**).
  - Search tasks by title via a live search filter.
  - Filter tasks using interactive category/completion tabs.
  - Toggle completion state instantly with clean animations.
  - Delete tasks via hover-activated quick action buttons.
- **Robust REST API:** Designed with FastAPI, featuring automated interactive Swagger documentation, request schema validations, and standard CORS middleware support.

---

## 📁 Repository Structure

```
├── backend/
│   └── main.py          # FastAPI application, routing, models, and in-memory DB
├── frontend/
│   ├── index.html       # HTML5 structure with semantic layout and SEO setup
│   ├── style.css        # Premium custom styles (CSS Variables, Grid/Flexbox)
│   └── app.js           # Async state management, API calls, dynamic DOM rendering
├── .gitignore           # Smart ignores for Python, environments, OS, and Node
└── README.md            # You are here!
```

---

## 🚀 Quick Start Guide

### 1. Run the Backend (FastAPI)

Ensure you have Python 3.8+ installed.

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install FastAPI and Uvicorn:
   ```bash
   pip install fastapi uvicorn
   ```
4. Start the server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be running at **`http://127.0.0.1:8000`**.
   You can view the interactive API documentation at **`http://127.0.0.1:8000/docs`**.

---

### 2. Run the Frontend

The frontend is built using pure, vanilla web standards, so it has no dependencies or compilation steps.

- **Option A (Fastest):** Simply double-click `frontend/index.html` to open it directly in any browser.
- **Option B (Recommended):** Serve it with a local HTTP server to avoid CORS issues:
  ```bash
  cd frontend
  python3 -m http.server 3000
  ```
  Then visit **`http://localhost:3000`** in your browser.

---

## ☁️ Cloud Deployment Guide

You can deploy this full-stack application completely for free using modern cloud hosting:

### 1. Backend Deployment (Render or Railway)
- **Render Setup:**
  1. Create a new **Web Service** linked to your GitHub repository.
  2. Set **Root Directory** to `backend`.
  3. Set **Start Command** to `uvicorn main:app --host 0.0.0.0 --port $PORT`.
  4. Ensure your python build environment has dependencies installed automatically via the provided `requirements.txt`.
- **Railway Setup:**
  1. Add a new service linked to your repository.
  2. Railway will automatically read `backend/Procfile` and launch your API service using the correct port mapping.

### 2. Frontend Deployment (Vercel)
- Create a new project in **Vercel** connected to your repository.
- Vercel will automatically read `vercel.json` in the root folder, rewriting all static URL routings to serve pages from the `frontend/` directory with zero manual configuration.

### 3. Wiring Hosted Environments
To connect your hosted frontend to your hosted API:
1. Open the hosted Vercel application in your web browser.
2. Open the browser's developer console (F12).
3. Type the following command (substituting with your actual backend URL) and refresh:
   ```javascript
   localStorage.setItem("API_BASE_URL", "https://your-backend-api.onrender.com");
   ```

