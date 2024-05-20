@echo off


:: List directories and check if there is a "consumerserver" directory
:: Check if the directory "consumerserver" exists


:: Load environment variables from .env file if it exists
if exist .env (
    for /f "delims=" %%x in (.env) do (
        set "%%x"
    )
)

:: Default port if not set in .env
if not defined PORT set PORT=8080

:: Build the Docker image
docker build --build-arg PORT=%PORT% -t vlms-consumer .

:: Check if the build was successful
if %errorlevel%==0 (
    echo Docker image built successfully.
    
    :: Run the Docker container
    docker run -p %PORT%:%PORT% -d vlms-consumer 
    
    if %errorlevel%==0 (
        echo Docker container started successfully.
    ) else (
        echo Failed to start the Docker container.
    )
) else (
    echo Docker image build failed.
)