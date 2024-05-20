@echo off

pip install python-dotenv || echo python-dotenv is already installed

if %errorlevel%==0 (
    echo python-dotenv installed successfully.
    
) else (
    echo python-dotenv installation failed.
)
