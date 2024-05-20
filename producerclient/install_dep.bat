@echo off

pip install pick || echo pick is already installed

if %errorlevel%==0 (
    echo pick installed successfully.
    
) else (
    echo pick installation failed.
)
