# 🌸 Taskflow // Your Cozy Personal Task Space

Welcome to **Taskflow**, a beautiful, premium, full-stack personal task tracker designed with comfort, mindfulness, and visual excellence. Featuring a soothing cream-linen pastel design, dynamic statistic counters, live search, priority filtering, and a robust SQLAlchemy-backed FastAPI backend, Taskflow helps you manage your day one calm step at a time.

---

## 🔗 Live Deployments (Railway Only)

Taskflow is fully hosted and operational on **Railway** as a multi-service monorepo:

*   **🎨 Live Frontend Website:** [https://personal-task-tracker-production.up.railway.app](https://personal-task-tracker-production.up.railway.app)
*   **📡 Live Backend API:** [https://precious-education-production-25c7.up.railway.app](https://precious-education-production-25c7.up.railway.app)
*   **📖 Interactive Swagger API Docs:** [https://precious-education-production-25c7.up.railway.app/docs](https://precious-education-production-25c7.up.railway.app/docs)

---

## 🎨 Soothing & Premium Features

### Soothing Pastel Frontend
*   **Comforting Aesthetics:** Soft cream-linen card layouts, glowing background ambient blur spots, and organic rounded corners utilizing the **Quicksand** Google Font family.
*   **Aesthetic Illustration Banner:** Custom hand-drawn cozy study room banner (`cozy_workspace.png`) to inspire mindful productivity.
*   **Dynamic Stats board:** Stat counters for *Total Notes*, *To Do*, and *Finished* tasks with rolling counter animations.
*   **Smooth UX:** Elegant custom-designed checkboxes, hover-revealed delete action buttons, custom notifications (toasts), and skeleton loaders during API latency.
*   **Live Filters & Search:** Live, case-insensitive keyword search and completion/priority filtering tabs.

### Robust FastAPI Backend
*   **SQLAlchemy Persistence:** Leverages SQLite database (`tasks.db`) with an auto-seeded database schema.
*   **Pydantic Validations:** Implements Pydantic v2 schemas (`TaskCreate`, `TaskUpdate`, and `TaskResponse`) guaranteeing robust data sanitization.
*   **Optimal CORS Policy:** Fully configured for cross-origin browser requests with custom allowed protocols.
*   **Flexible DB Pathing:** Automatically detects its running environment—storing database files in a writable `/tmp/tasks.db` directory on Railway, while keeping local `tasks.db` inside the project folder for local development.

---

## 📁 Repository Structure

```text
├── backend/
│   ├── database.py       # SQLAlchemy engine initialization and session management
│   ├── main.py           # FastAPI server routing, CORS setup, and CRUD handlers
│   ├── models.py         # SQLAlchemy data models representing task schemas
│   ├── schemas.py        # Pydantic validation schemas
│   ├── Procfile          # Process execution command for Railway
│   └── requirements.txt  # Python package dependencies
├── frontend/
│   ├── index.html        # Clean, semantic layout with cozy pastel structures
│   ├── style.css         # 900+ lines of custom glassmorphic styling
│   ├── app.js            # Core async application logic and API communication
│   ├── cozy_workspace.png # Cozy, high-resolution header illustration
│   ├── Dockerfile        # Node Alpine container script for stable Railway hosting
│   └── server.js         # Custom Node static server with dynamic PORT mapping
├── vercel.json           # Optional Vercel redirect routing configuration
└── README.md             # You are here!
```

---

## 🚀 How to Run Locally

### 1. Start the Backend API (FastAPI)
Ensure you have **Python 3.8+** installed.

1.  Navigate into the `backend/` directory:
    ```bash
    cd backend
    ```
2.  Create and activate a Python virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Start the FastAPI local development server:
    ```bash
    uvicorn main:app --reload
    ```
    *   The API server will boot up at **`http://127.0.0.1:8000`**.
    *   Access the live interactive API documentation (Swagger) at **`http://127.0.0.1:8000/docs`**.

---

### 2. Start the Frontend Website
The frontend uses pure, vanilla web standards, so it doesn't need heavy npm compilations.

*   **Option A (Python Server - Recommended):**
    ```bash
    cd frontend
    python3 -m http.server 3000
    ```
    Now, open your web browser and visit **`http://localhost:3000`**.
*   **Option B (Directly opening HTML):**
    Simply navigate to your `frontend/` folder on your machine and double-click `index.html` to open it in your browser of choice!

---

## ☁️ Zero-Config Railway Deployment Details

Both the frontend and backend are configured to build automatically on Railway with zero manual command configuration required:

*   **Backend Service:** Railway automatically reads `backend/Procfile` to run Uvicorn. The SQLite database is automatically written to `/tmp/tasks.db` inside the container to avoid read-only filesystem errors.
*   **Frontend Service:** Built on top of a standard lightweight **Node Alpine** Docker image. It skips Railway's unstable default builders and uses the custom `server.js` static wrapper to dynamically bind to Railway's assigned port.

Take a deep breath. Enjoy organizing your thoughts! 🌸🍵
