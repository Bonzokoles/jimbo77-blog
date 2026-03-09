@echo off
TITLE JIMBO77 - PUBLISHER MOA SYSTEM
color 0A

echo ===================================================
echo   JIMBO77 PUBLISHER - MOA Production System
echo   Blog: jimbo77.org  |  Deploy: Vercel
echo ===================================================
echo.

cd /d "%~dp0"

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Install Python 3.10+
    pause
    exit /b 1
)

REM Check .env
if not exist ".env" (
    echo [WARN] .env not found! Copy .env.example to .env and fill API keys.
    echo.
)

REM Install dependencies if needed
if not exist "venv" (
    echo [SETUP] Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
    echo.
) else (
    call venv\Scripts\activate
)

echo.
echo [1/3] Starting SUB-AGENTS (The Swarm)...
echo -------------------------------------------
start "Writer Agent (6030)" /min cmd /k "title Writer Agent && cd /d %~dp0 && call venv\Scripts\activate && python agents\writer_agent.py"
echo   + Writer Agent  -> http://localhost:6030
start "SEO Agent (6031)" /min cmd /k "title SEO Agent && cd /d %~dp0 && call venv\Scripts\activate && python agents\seo_agent.py"
echo   + SEO Agent     -> http://localhost:6031
start "Research Agent (6062)" /min cmd /k "title Research Agent && cd /d %~dp0 && call venv\Scripts\activate && python agents\research_agent.py"
echo   + Research Agent -> http://localhost:6062

echo.
echo [2/3] Waiting for agents to initialize...
timeout /t 5 /nobreak >nul

echo.
echo [3/3] ALL SYSTEMS GO!
echo ===================================================
echo   Writer Agent:   http://localhost:6030
echo   SEO Agent:      http://localhost:6031
echo   Research Agent:  http://localhost:6062
echo ===================================================
echo.
echo USAGE (run in a new terminal):
echo   cd publisher
echo   call venv\Scripts\activate
echo   python publisher_workflow.py --daily --deploy
echo   python publisher_workflow.py --daily --category "AI Odkrycia" --deploy
echo   python publisher_workflow.py --topic "Moj nowy projekt" --deploy
echo.
pause
