from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

import models
import schemas
from database import engine, SessionLocal, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Seed the database on startup if empty
db = SessionLocal()
try:
    if db.query(models.Task).count() == 0:
        initial_tasks = [
            models.Task(
                title="Set up project structure",
                description="Establish backend and frontend directories with standard config files.",
                priority="High",
                completed=True
            ),
            models.Task(
                title="Build FastAPI backend",
                description="Create robust REST endpoints for task CRUD operations.",
                priority="High",
                completed=False
            ),
            models.Task(
                title="Design interactive UI",
                description="Construct a premium, responsive dark-mode dashboard with smooth animations.",
                priority="Medium",
                completed=False
            )
        ]
        db.add_all(initial_tasks)
        db.commit()
finally:
    db.close()

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

# CRUD Endpoints

@app.get("/tasks", response_model=List[schemas.TaskResponse], status_code=status.HTTP_200_OK)
def get_tasks(
    search: Optional[str] = None, 
    completed: Optional[bool] = None, 
    db: Session = Depends(get_db)
):
    """
    Retrieve all tasks with optional search and completion filtering.
    """
    query = db.query(models.Task)
    
    if completed is not None:
        query = query.filter(models.Task.completed == completed)
        
    if search:
        search_lower = search.lower()
        query = query.filter(
            func.lower(models.Task.title).contains(search_lower) |
            func.lower(models.Task.description).contains(search_lower)
        )
        
    return query.all()

@app.get("/tasks/{task_id}", response_model=schemas.TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific task by its ID.
    """
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Task with ID {task_id} not found."
        )
    return task

@app.post("/tasks", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task_in: schemas.TaskCreate, db: Session = Depends(get_db)):
    """
    Create a new task in the database.
    """
    # Validation check for priority
    valid_priorities = ["High", "Medium", "Low"]
    priority = task_in.priority
    if priority not in valid_priorities:
        priority = "Medium"

    new_task = models.Task(
        title=task_in.title,
        description=task_in.description,
        priority=priority,
        completed=False
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, task_in: schemas.TaskUpdate, db: Session = Depends(get_db)):
    """
    Update details or status of an existing task.
    """
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found."
        )

    # Apply updates
    if task_in.title is not None:
        db_task.title = task_in.title
    if task_in.description is not None:
        db_task.description = task_in.description
    if task_in.priority is not None:
        valid_priorities = ["High", "Medium", "Low"]
        if task_in.priority in valid_priorities:
            db_task.priority = task_in.priority
    if task_in.completed is not None:
        db_task.completed = task_in.completed

    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """
    Delete a task by its ID.
    """
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found."
        )
    db.delete(db_task)
    db.commit()
    return