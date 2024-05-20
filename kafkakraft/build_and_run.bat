@echo off

docker compose up -d

:: Check if the build was successful
if %errorlevel%==0 (
    echo Docker image built and started successfully.
    
) else (
    echo Docker image build failed.
)
