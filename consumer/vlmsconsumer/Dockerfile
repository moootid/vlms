# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code to the working directory
COPY . .

# Build the app
RUN npx vite build

# Expose the port that the app will run on
ARG PORT
ENV PORT=${PORT}
EXPOSE ${PORT}

# Define the command to run the app
CMD npx vite preview --host 0.0.0.0 --port ${PORT} 