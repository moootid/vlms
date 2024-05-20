# Use the official Node.js image as the base image
FROM oven/bun:1 as base

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY . .

# Install the dependencies
RUN bun install

# Expose the port specified in the .env file
ARG PORT
ENV PORT=${PORT}
EXPOSE ${PORT}

# Copy the rest of the application code to the working directory
CMD ["bun", "run", "index.ts"]