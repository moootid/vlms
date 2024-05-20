#!/bin/bash

# Function to print an error message and exit
error_exit() {
    echo "$1" 1>&2
    exit 1
}

# Check if pip is installed
command -v pip >/dev/null 2>&1 || error_exit "pip is not installed. Please install pip and try again."

# Install python-dotenv
pip install python-dotenv || error_exit "Failed to install python-dotenv. Please check your network connection and try again."

# Print success message
echo "python-dotenv installed successfully."
