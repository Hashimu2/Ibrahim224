@echo off
title Publish Ibrahim Hashimu Portfolio to GitHub Pages
echo ========================================================
echo  Publishing Portfolio to GitHub: Hashimu2/Ibrahim224
echo ========================================================
set "PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%PATH%"
git add .
git commit -m "Publish Ibrahim Hashimu authentic public health portfolio"
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Portfolio successfully pushed to GitHub!
    echo Your public repository: https://github.com/Hashimu2/Ibrahim224
    echo Your public live web link: https://hashimu2.github.io/Ibrahim224/
) else (
    echo [INFO] If prompted for credentials:
    echo 1. Enter your GitHub Username: Hashimu2
    echo 2. For Password, enter your GitHub Personal Access Token (classic)
    echo    Generate one at: https://github.com/settings/tokens
)
echo ========================================================
pause
