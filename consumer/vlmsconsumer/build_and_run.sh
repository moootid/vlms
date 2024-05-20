#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Default port if not set in .env
PORT=${PORT:-3000}

# Build the Docker image
docker build --build-arg PORT=$PORT -t vlmsweb .

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Docker image built successfully."
  
  # Run the Docker container
  docker run -d -p $PORT:$PORT vlmsweb
  
  if [ $? -eq 0 ]; then
    echo "Docker container started successfully."
    # Open localhost:3000 in the default web browser
    if command -v xdg-open > /dev/null; then
      xdg-open http://localhost:$PORT
    elif command -v open > /dev/null; then
      open http://localhost:$PORT
    else
      echo "Could not detect the web browser to open localhost:$PORT."
      echo "✅ Please open your web browser and navigate to http://localhost:$PORT. ✅"
    fi
  else
    echo "Failed to start the Docker container."
  fi
else
  echo "Docker image build failed."
fi
