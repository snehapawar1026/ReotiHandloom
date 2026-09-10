@echo off
echo Pushing Reoti Handloom Website to GitHub (snehapawar1026/ReotiHandloom_Website)...
git remote remove origin 2>nul
git remote add origin https://github.com/snehapawar1026/ReotiHandloom_Website.git
git branch -M main
git push -u origin main
pause
