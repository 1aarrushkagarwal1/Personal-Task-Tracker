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
