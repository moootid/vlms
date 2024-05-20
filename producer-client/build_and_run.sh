#!/bin/bash

# Build the Docker image
docker build -t vlms-producer .

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Docker image built successfully."
  
  # Run the Docker container
  docker run -d vlms-producer
  
  if [ $? -eq 0 ]; then
    echo "Docker container started successfully."
  else
    echo "Failed to start the Docker container."
  fi
else
  echo "Docker image build failed."
fi
