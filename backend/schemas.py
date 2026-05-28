from pydantic import BaseModel, Field
from typing import Optional

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
