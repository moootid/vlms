@echo off

:: Load environment variables from .env file if it exists
if exist .env (
    for /f "delims=" %%x in (.env) do (
        set "%%x"
    )
)

:: Default port if not set in .env
if not defined PORT set PORT=3000

:: Build the Docker image
docker build --build-arg PORT=%PORT% -t vlmsweb .

:: Check if the build was successful
if %errorlevel%==0 (
    echo Docker image built successfully.
    
    :: Run the Docker container
    docker run -d -p %PORT%:%PORT% vlmsweb 
    
    if %errorlevel%==0 (
        echo Docker container started successfully.
        :: Open localhost:%PORT% in the default web browser
        start http://localhost:%PORT%
    ) else (
        echo Failed to start the Docker container.
    )
) else (
    echo Docker image build failed.
)
