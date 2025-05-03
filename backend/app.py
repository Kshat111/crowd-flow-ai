from fastapi import FastAPI, File, UploadFile, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
import uvicorn
import os
import sys
import uuid
import time
import subprocess
import shutil
from typing import List, Dict, Optional
import json

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories for storing videos and results
os.makedirs("uploads", exist_ok=True)
os.makedirs("results", exist_ok=True)
os.makedirs("static", exist_ok=True)

# Mount a static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Store processing tasks and their status
processing_tasks = {}

@app.post("/api/upload")
async def upload_video(file: UploadFile = File(...)):
    """
    Upload a video file for processing
    """
    # Generate a unique ID for this upload
    task_id = str(uuid.uuid4())
    
    # Save the uploaded file
    file_path = f"uploads/{task_id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return the task ID and original filename
    return {
        "task_id": task_id,
        "filename": file.filename,
        "status": "uploaded",
        "message": "Video uploaded successfully"
    }

@app.post("/api/process/{task_id}")
async def process_video(task_id: str, background_tasks: BackgroundTasks, 
                       enhanced: bool = True, 
                       model_size: str = "x"):
    """
    Process an uploaded video with the crowd analysis model
    """
    # Find the uploaded file for this task_id
    file_path = None
    for filename in os.listdir("uploads"):
        if filename.startswith(task_id):
            file_path = f"uploads/{filename}"
            break
    
    if not file_path:
        raise HTTPException(status_code=404, detail="Uploaded file not found")
    
    # Set up the output path
    output_path = f"results/{task_id}_output.mp4"
    
    # Update task status
    processing_tasks[task_id] = {
        "status": "processing",
        "start_time": time.time(),
        "output_path": output_path,
        "file_path": file_path
    }
    
    # Run the processing in the background
    background_tasks.add_task(
        run_crowd_analysis,
        task_id,
        file_path,
        output_path,
        enhanced,
        model_size
    )
    
    return {
        "task_id": task_id,
        "status": "processing",
        "message": "Video processing started"
    }

@app.get("/api/status/{task_id}")
async def get_status(task_id: str):
    """
    Get the status of a processing task
    """
    if task_id not in processing_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = processing_tasks[task_id]
    
    # Calculate processing time if task is completed
    elapsed_time = None
    if "end_time" in task and "start_time" in task:
        elapsed_time = task["end_time"] - task["start_time"]
    
    response = {
        "task_id": task_id,
        "status": task["status"],
        "message": task.get("message", "")
    }
    
    # Add additional information if available
    if "result_url" in task:
        response["result_url"] = task["result_url"]
    
    if elapsed_time is not None:
        response["processing_time"] = f"{elapsed_time:.2f} seconds"
    
    if "error" in task:
        response["error"] = task["error"]
    
    if "metrics" in task:
        response["metrics"] = task["metrics"]
    
    return response

@app.get("/api/result/{task_id}")
async def get_result(task_id: str):
    """
    Get the processed video result
    """
    if task_id not in processing_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = processing_tasks[task_id]
    
    if task["status"] != "completed":
        raise HTTPException(status_code=400, detail="Processing not completed")
    
    if not os.path.exists(task["output_path"]):
        raise HTTPException(status_code=404, detail="Result file not found")
    
    return FileResponse(task["output_path"])

@app.get("/api/preloaded-videos")
async def get_preloaded_videos():
    """
    Get a list of pre-loaded videos available for processing
    """
    # Directory containing pre-loaded videos
    preloaded_dir = "preloaded"
    
    # Ensure the directory exists
    if not os.path.exists(preloaded_dir):
        os.makedirs(preloaded_dir, exist_ok=True)
        # You might want to copy some sample videos here
    
    # List all video files in the preloaded directory
    video_extensions = ['.mp4', '.avi', '.mov', '.mkv']
    videos = []
    
    for filename in os.listdir(preloaded_dir):
        ext = os.path.splitext(filename)[1].lower()
        if ext in video_extensions:
            video_path = f"{preloaded_dir}/{filename}"
            # Get video file size
            size_bytes = os.path.getsize(video_path)
            size_mb = size_bytes / (1024 * 1024)
            
            videos.append({
                "id": filename,
                "name": filename,
                "path": video_path,
                "size": f"{size_mb:.2f} MB"
            })
    
    return {"videos": videos}

@app.post("/api/process-preloaded/{video_id}")
async def process_preloaded_video(video_id: str, background_tasks: BackgroundTasks,
                                 enhanced: bool = True,
                                 model_size: str = "x"):
    """
    Process a pre-loaded video
    """
    # Find the video in the preloaded directory
    preloaded_dir = "preloaded"
    file_path = f"{preloaded_dir}/{video_id}"
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Pre-loaded video not found")
    
    # Generate a task ID
    task_id = str(uuid.uuid4())
    
    # Set up the output path
    output_path = f"results/{task_id}_output.mp4"
    
    # Update task status
    processing_tasks[task_id] = {
        "status": "processing",
        "start_time": time.time(),
        "output_path": output_path,
        "file_path": file_path
    }
    
    # Run the processing in the background
    background_tasks.add_task(
        run_crowd_analysis,
        task_id,
        file_path,
        output_path,
        enhanced,
        model_size
    )
    
    return {
        "task_id": task_id,
        "video_id": video_id,
        "status": "processing",
        "message": "Video processing started"
    }

def run_crowd_analysis(task_id: str, input_path: str, output_path: str, enhanced: bool, model_size: str):
    """
    Run the crowd analysis process using the Python script
    """
    try:
        # Build the command
        cmd = [
            sys.executable,  # Use the same Python interpreter
            "main.py",
            "--video-path", input_path,
            "--output", output_path,
            "--model-size", model_size
        ]
        
        if enhanced:
            cmd.append("--enhanced")
        
        # Execute the command
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Wait for the process to complete
        stdout, stderr = process.communicate()
        
        # Check if the process was successful
        if process.returncode == 0 and os.path.exists(output_path):
            # Update task status to completed
            processing_tasks[task_id]["status"] = "completed"
            processing_tasks[task_id]["end_time"] = time.time()
            processing_tasks[task_id]["result_url"] = f"/api/result/{task_id}"
            
            # Extract metrics from stdout if available
            metrics = parse_metrics_from_output(stdout)
            if metrics:
                processing_tasks[task_id]["metrics"] = metrics
            
            processing_tasks[task_id]["message"] = "Processing completed successfully"
        else:
            # Handle error
            processing_tasks[task_id]["status"] = "failed"
            processing_tasks[task_id]["end_time"] = time.time()
            processing_tasks[task_id]["error"] = stderr
            processing_tasks[task_id]["message"] = "Processing failed"
    
    except Exception as e:
        # Handle exceptions
        processing_tasks[task_id]["status"] = "failed"
        processing_tasks[task_id]["end_time"] = time.time()
        processing_tasks[task_id]["error"] = str(e)
        processing_tasks[task_id]["message"] = "Processing failed due to an exception"

def parse_metrics_from_output(output: str) -> Optional[Dict]:
    """
    Parse metrics from the processing output
    """
    metrics = {}
    
    # Look for crowd count information
    try:
        for line in output.split('\n'):
            if "Average crowd count:" in line:
                avg_count = float(line.split(':')[1].strip())
                metrics["average_crowd_count"] = avg_count
            
            if "Peak crowd count:" in line:
                peak_count = float(line.split(':')[1].strip())
                metrics["peak_crowd_count"] = peak_count
            
            if "Density map generated" in line:
                metrics["has_density_map"] = True
    except:
        pass
    
    return metrics if metrics else None

if __name__ == "__main__":
    # Run the FastAPI server
    uvicorn.run(app, host="0.0.0.0", port=8000)