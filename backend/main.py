from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional

app = FastAPI(
    title="Personal Task Tracker API",
    description="A modern, high-performance API scaffold for tracking personal tasks.",
    version="1.0.0"
)

# Enable CORS for smooth frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database for scaffolding
tasks_db = [
    {
        "id": 1,
        "title": "Set up project structure",
        "description": "Establish backend and frontend directories with standard config files.",
        "priority": "High",
        "completed": True
    },
    {
        "id": 2,
        "title": "Build FastAPI backend",
        "description": "Create robust REST endpoints for task CRUD operations.",
        "priority": "High",
        "completed": False
    },
    {
        "id": 3,
        "title": "Design interactive UI",
        "description": "Construct a premium, responsive dark-mode dashboard with smooth animations.",
        "priority": "Medium",
        "completed": False
    }
]

# Pydantic Schemas for validation
class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, description="The title of the task.")
    description: Optional[str] = Field("", max_length=500, description="Optional detailed description.")
    priority: str = Field("Medium", description="Task priority (High, Medium, Low).")

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    priority: Optional[str] = Field(None)
    completed: Optional[bool] = Field(None)

class TaskResponse(TaskBase):
    id: int
    completed: bool

    class Config:
        from_attributes = True

# CRUD Endpoints

@app.get("/tasks", response_model=List[TaskResponse], status_code=status.HTTP_200_OK)
def get_tasks(search: Optional[str] = None, completed: Optional[bool] = None):
    """
    Retrieve all tasks with optional search and completion filtering.
    """
    filtered_tasks = tasks_db
    
    if completed is not None:
        filtered_tasks = [t for t in filtered_tasks if t["completed"] == completed]
        
    if search:
        search_lower = search.lower()
        filtered_tasks = [
            t for t in filtered_tasks 
            if search_lower in t["title"].lower() or search_lower in t["description"].lower()
        ]
        
    return filtered_tasks

@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int):
    """
    Retrieve a specific task by its ID.
    """
    for task in tasks_db:
        if task["id"] == task_id:
            return task
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, 
        detail=f"Task with ID {task_id} not found."
    )

@app.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task_in: TaskCreate):
    """
    Create a new task in the database.
    """
    # Validation check for priority
    valid_priorities = ["High", "Medium", "Low"]
    if task_in.priority not in valid_priorities:
        task_in.priority = "Medium"

    new_id = max([t["id"] for t in tasks_db], default=0) + 1
    new_task = {
        "id": new_id,
        "title": task_in.title,
        "description": task_in.description,
        "priority": task_in.priority,
        "completed": False
    }
    tasks_db.append(new_task)
    return new_task

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_in: TaskUpdate):
    """
    Update details or status of an existing task.
    """
    task_idx = None
    for idx, t in enumerate(tasks_db):
        if t["id"] == task_id:
            task_idx = idx
            break

    if task_idx is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found."
        )

    current_task = tasks_db[task_idx]
    
    # Apply updates
    if task_in.title is not None:
        current_task["title"] = task_in.title
    if task_in.description is not None:
        current_task["description"] = task_in.description
    if task_in.priority is not None:
        valid_priorities = ["High", "Medium", "Low"]
        if task_in.priority in valid_priorities:
            current_task["priority"] = task_in.priority
    if task_in.completed is not None:
        current_task["completed"] = task_in.completed

    tasks_db[task_idx] = current_task
    return current_task

@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int):
    """
    Delete a task by its ID.
    """
    global tasks_db
    initial_length = len(tasks_db)
    tasks_db = [t for t in tasks_db if t["id"] != task_id]
    
    if len(tasks_db) == initial_length:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found."
        )
    return