#!/bin/bash


# Build the Docker image
docker compose up -d

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Docker image built and started successfully."
else
  echo "Docker image build failed."
  echo "Trying to build again with sudo..."
  sudo docker compose up -d
  if [ $? -eq 0 ]; then
    echo "Docker image built and started successfully."
  else
    echo "Docker image build failed."
  fi
fi