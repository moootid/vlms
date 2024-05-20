@echo off

:: Build the Docker image
docker build -t vlms-producer .

:: Check if the build was successful
if %errorlevel%==0 (
    echo Docker image built successfully.
    
    :: Run the Docker container
    docker run -d vlms-producer 
    
    if %errorlevel%==0 (
        echo Docker container started successfully.
    ) else (
        echo Failed to start the Docker container.
    )
) else (
    echo Docker image build failed.
)
