#!/bin/bash

# Function to print an error message and exit
error_exit() {
    echo "$1" 1>&2
    exit 1
}

# Check if pip is installed
command -v pip >/dev/null 2>&1 || error_exit "pip is not installed. Please install pip and try again."

# Install pick
pip install pick || error_exit "Failed to install pick. Please check your network connection and try again."

if [ $? -ne 0 ]; then
    pip3 install pick || error_exit "Failed to install pick. Please check your network connection and try again."
fi

# Print success message
echo "pick installed successfully."
