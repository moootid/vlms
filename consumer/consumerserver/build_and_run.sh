#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Default port if not set in .env
PORT=${PORT:-8080}

# Build the Docker image
docker build --build-arg PORT=$PORT -t vlms-consumer .

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Docker image built successfully."
  
  # Run the Docker container
  docker run -d -p $PORT:$PORT vlms-consumer
  
  if [ $? -eq 0 ]; then
    echo "Docker container started successfully."
  else
    echo "Failed to start the Docker container."
  fi
else
  echo "Docker image build failed."
fi
