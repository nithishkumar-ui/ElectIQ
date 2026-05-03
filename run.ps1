Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit -Command `"cd backend; uvicorn main:app --reload`"" -WindowStyle Normal
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit -Command `"cd frontend; npm run dev`"" -WindowStyle Normal
