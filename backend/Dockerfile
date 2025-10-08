# Development Dockerfile for FastAPI backend
FROM python:3.11-slim

WORKDIR /code

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy application code
COPY app/ /code/app/

# Expose port
EXPOSE 8000

# Run FastAPI in development mode with auto-reload
CMD ["fastapi", "dev", "app/main.py", "--host", "0.0.0.0", "--port", "8000"]
