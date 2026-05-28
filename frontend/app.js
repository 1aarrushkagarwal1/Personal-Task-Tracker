/* ----------------------------------------------------
   Taskflow Core Application Logic (Vanilla JavaScript)
   Handles: State Management, CRUD operations with FastAPI, 
            Search/Filter, Toast notifications & Skeletons.
   ---------------------------------------------------- */

let API_BASE = localStorage.getItem("API_BASE_URL") || (
    window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
        ? "http://127.0.0.1:8000"
        : "https://personal-task-tracker-backend.onrender.com" // Default fallback production URL
);

// Toggle API Connection settings drawer
function toggleApiSettings() {
    const fields = document.getElementById("apiConfigFields");
    fields.classList.toggle("hidden");
}

// Save Custom API URL from Settings Panel
function saveCustomApiUrl() {
    const input = document.getElementById("customApiUrlInput");
    let url = input.value.trim();
    if (!url) {
        localStorage.removeItem("API_BASE_URL");
    } else {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }
        if (url.endsWith("/")) url = url.slice(0, -1);
        localStorage.setItem("API_BASE_URL", url);
    }
    window.location.reload();
}

// Save Custom API URL from Empty State
function saveEmptyStateApiUrl() {
    const input = document.getElementById("emptyStateApiInput");
    let url = input.value.trim();
    if (url) {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }
        if (url.endsWith("/")) url = url.slice(0, -1);
        localStorage.setItem("API_BASE_URL", url);
    }
    window.location.reload();
}

// App State
let tasksState = [];
let activeFilter = "all";
let searchQuery = "";

// DOM Elements
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const taskForm = document.getElementById("taskForm");
const taskTitleInput = document.getElementById("taskTitle");
const taskDescInput = document.getElementById("taskDesc");
const searchInput = document.getElementById("searchInput");
const submitBtn = document.getElementById("submitBtn");

// Stats Counts
const totalCountEl = document.getElementById("totalTasksCount");
const pendingCountEl = document.getElementById("pendingTasksCount");
const completedCountEl = document.getElementById("completedTasksCount");

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
    fetchTasks();
});

// Toast System Utility
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    
    // Create Toast Element
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    // Cozy emoji icons depending on status
    let icon = "🍵";
    if (type === "success") icon = "🌸";
    if (type === "error") icon = "☁️";
    
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    // Animate In
    setTimeout(() => {
        toast.classList.add("show");
    }, 10);
    
    // Animate Out & Delete
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3000);
}

// Show skeleton loaders during API calls
function renderSkeletons() {
    taskList.innerHTML = "";
    emptyState.classList.add("hidden");
    
    for (let i = 0; i < 3; i++) {
        const skeleton = document.createElement("li");
        skeleton.className = "skeleton-item";
        skeleton.innerHTML = `
            <div class="skeleton-line title"></div>
            <div class="skeleton-line desc"></div>
            <div class="skeleton-line badge"></div>
        `;
        taskList.appendChild(skeleton);
    }
}

// Fetch all tasks from backend
async function fetchTasks(silent = false) {
    if (!silent) renderSkeletons();
    
    const indicator = document.getElementById("apiStatusIndicator");
    const statusText = document.getElementById("apiStatusText");
    const input = document.getElementById("customApiUrlInput");
    
    try {
        const response = await fetch(`${API_BASE}/tasks`);
        if (!response.ok) {
            throw new Error(`Server returned code ${response.status}`);
        }
        tasksState = await response.json();
        
        // Update connection status UI to green success
        if (indicator && statusText) {
            indicator.innerText = "🟢";
            statusText.innerText = "Connected";
            statusText.style.color = "var(--accent-mint-text)";
        }
        if (input) input.value = API_BASE;
        
        updateStats();
        applyFiltersAndRender();
    } catch (error) {
        console.error("Error fetching tasks:", error);
        showToast("Unable to reach backend. Let's check the connection! 🔌", "error");
        
        // Update connection status UI to red failure
        if (indicator && statusText) {
            indicator.innerText = "🔴";
            statusText.innerText = "Offline";
            statusText.style.color = "var(--priority-high-text)";
        }
        if (input) input.value = API_BASE;
        
        taskList.innerHTML = "";
        
        // Custom self-healing empty state based on local/production hosting
        let connectionHelp = "";
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            connectionHelp = `<p>Please launch your FastAPI server locally by running <code>uvicorn main:app --reload</code> inside the <code>backend/</code> folder.</p>`;
        } else {
            connectionHelp = `
                <p>Your frontend is hosted, but the backend API is unreachable at:<br><code style="word-break: break-all; color: var(--text-secondary); font-size: 0.8rem; background: rgba(180,170,160,0.1); padding: 2px 6px; border-radius: 4px; display: inline-block; margin: 5px 0 15px 0;">${API_BASE}</code></p>
                <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 320px; margin: 10px auto;">
                    <input type="text" id="emptyStateApiInput" placeholder="https://your-api.up.railway.app" value="${API_BASE}" style="width: 100%; text-align: center; border-radius: var(--radius-sm);">
                    <button type="button" onclick="saveEmptyStateApiUrl()" class="submit-btn" style="padding: 10px; font-size: 0.85rem; border-radius: var(--radius-sm);">Connect to Backend</button>
                </div>
            `;
        }
        
        emptyState.innerHTML = `
            <div class="empty-icon">🔌</div>
            <h3>Unable to reach backend</h3>
            ${connectionHelp}
        `;
        emptyState.classList.remove("hidden");
    }
}

// Update the Top Dashboard Statistics Bar
function updateStats() {
    const total = tasksState.length;
    const completed = tasksState.filter(t => t.completed).length;
    const pending = total - completed;
    
    // Animate counters if changed
    animateCounter(totalCountEl, parseInt(totalCountEl.innerText) || 0, total);
    animateCounter(pendingCountEl, parseInt(pendingCountEl.innerText) || 0, pending);
    animateCounter(completedCountEl, parseInt(completedCountEl.innerText) || 0, completed);
}

// Small helper to animate numbers rolling up/down
function animateCounter(element, start, end) {
    if (start === end) {
        element.innerText = end;
        return;
    }
    let current = start;
    const duration = 400; // ms
    const stepTime = Math.abs(Math.floor(duration / (end - start || 1)));
    const increment = end > start ? 1 : -1;
    
    const timer = setInterval(() => {
        current += increment;
        element.innerText = current;
        if (current === end) {
            clearInterval(timer);
        }
    }, Math.max(stepTime, 20));
}

// Set active tab filter and update styling
function setFilter(filterType) {
    activeFilter = filterType;
    
    // Highlight correct tab
    const tabs = document.querySelectorAll(".filter-tab");
    tabs.forEach(tab => {
        if (tab.getAttribute("data-filter") === filterType) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });
    
    applyFiltersAndRender();
}

// Live search handler
function handleSearch() {
    searchQuery = searchInput.value.toLowerCase().trim();
    applyFiltersAndRender();
}

// Process filters and query inputs then draw DOM
function applyFiltersAndRender() {
    let filtered = [...tasksState];
    
    // Apply Completion Filter
    if (activeFilter === "active") {
        filtered = filtered.filter(t => !t.completed);
    } else if (activeFilter === "completed") {
        filtered = filtered.filter(t => t.completed);
    }
    // Apply Priority Filter
    else if (["High", "Medium", "Low"].includes(activeFilter)) {
        filtered = filtered.filter(t => t.priority === activeFilter);
    }
    
    // Apply Search Query
    if (searchQuery) {
        filtered = filtered.filter(t => 
            t.title.toLowerCase().includes(searchQuery) || 
            (t.description || "").toLowerCase().includes(searchQuery)
        );
    }
    
    renderTasks(filtered);
}

// Draw task items on the screen
function renderTasks(tasks) {
    taskList.innerHTML = "";
    
    if (tasks.length === 0) {
        emptyState.classList.remove("hidden");
        return;
    }
    
    emptyState.classList.add("hidden");
    
    tasks.forEach(task => {
        const item = document.createElement("li");
        item.className = `task-item ${task.completed ? 'completed' : ''}`;
        item.dataset.id = task.id;
        
        // Priority Badge styles
        const badgeClass = `badge priority-${task.priority.toLowerCase()}`;
        
        item.innerHTML = `
            <!-- Checkbox -->
            <label class="task-checkbox-container" aria-label="Toggle Complete">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="handleToggleStatus(${task.id}, ${task.completed})">
                <span class="checkmark">
                    <svg viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </span>
            </label>
            
            <!-- Details -->
            <div class="task-details">
                <div class="task-title-line">
                    <span class="task-title">${escapeHTML(task.title)}</span>
                    <span class="${badgeClass}">${task.priority}</span>
                </div>
                ${task.description ? `<p class="task-desc">${escapeHTML(task.description)}</p>` : ''}
            </div>
            
            <!-- Action buttons -->
            <div class="task-actions">
                <button class="delete-btn" onclick="handleDeleteTask(${task.id})" title="Delete Task" aria-label="Delete Task">
                    🗑️
                </button>
            </div>
        `;
        
        taskList.appendChild(item);
    });
}

// Escape helper to prevent basic injection/XSS issues
function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Form submission handler
async function handleFormSubmit() {
    const title = taskTitleInput.value.trim();
    const description = taskDescInput.value.trim();
    const priority = document.querySelector('input[name="taskPriority"]:checked').value;
    
    if (!title) return;
    
    // Disable inputs during submission
    setFormLoadingState(true);
    
    try {
        const response = await fetch(`${API_BASE}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                description,
                priority
            })
        });
        
        if (!response.ok) {
            if (response.status === 422) {
                const errData = await response.json();
                const errMsg = errData.detail?.[0]?.msg || "Invalid input details";
                throw new Error(errMsg);
            }
            throw new Error("Failed to add task");
        }
        
        const newTask = await response.json();
        showToast(`Added "${newTask.title}" to your flow! 🌸`, "success");
        
        // Reset and reload
        taskForm.reset();
        await fetchTasks(true);
    } catch (error) {
        console.error("Error creating task:", error);
        showToast(error.message || "Error adding task. Let's check the server connection. ☁️", "error");
    } finally {
        setFormLoadingState(false);
    }
}

// Toggle form inputs while loading
function setFormLoadingState(isLoading) {
    submitBtn.disabled = isLoading;
    const btnText = submitBtn.querySelector(".btn-text");
    
    if (isLoading) {
        submitBtn.style.opacity = "0.7";
        btnText.innerText = "Adding...";
    } else {
        submitBtn.style.opacity = "1";
        btnText.innerText = "Add Task";
    }
}

// Toggle Checked / Unchecked status
async function handleToggleStatus(taskId, currentStatus) {
    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                completed: !currentStatus
            })
        });
        
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const errMsg = errData.detail || "Failed to update status";
            throw new Error(errMsg);
        }
        
        const updatedTask = await response.json();
        const stateWord = updatedTask.completed ? "finished" : "active";
        showToast(`Task is now ${stateWord}! ✨`, updatedTask.completed ? "success" : "info");
        
        await fetchTasks(true);
    } catch (error) {
        console.error("Error updating status:", error);
        showToast(error.message || "Couldn't update status. Let's try again. ☁️", "error");
        // Revert UI checkbox visual
        fetchTasks(true);
    }
}

// Delete task from DB
async function handleDeleteTask(taskId) {
    const taskItem = document.querySelector(`.task-item[data-id="${taskId}"]`);
    
    // Add deletion visual effect first
    if (taskItem) {
        taskItem.style.transform = "translateX(-20px) scale(0.95)";
        taskItem.style.opacity = "0";
        taskItem.style.transition = "all 0.3s ease-out";
    }
    
    setTimeout(async () => {
        try {
            const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
                method: "DELETE"
            });
            
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                const errMsg = errData.detail || "Failed to delete task";
                throw new Error(errMsg);
            }
            
            showToast("Task removed from flow. 🍃", "info");
            await fetchTasks(true);
        } catch (error) {
            console.error("Error deleting task:", error);
            showToast(error.message || "Couldn't remove task. Let's try again. ☁️", "error");
            await fetchTasks(true);
        }
    }, 250);
}
