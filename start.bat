@echo off
echo 🚀 Iniciando Comercio Internacional...
echo.

echo 📡 Iniciando Backend (Puerto 5000)...
start "Backend" cmd /k "npm run server"

echo ⏳ Esperando 5 segundos...
timeout /t 5 /nobreak > nul

echo 🌐 Iniciando Frontend (Puerto 3000)...
start "Frontend" cmd /k "npm start"

echo.
echo ✅ ¡Ambos servidores iniciados!
echo 📡 Backend: http://localhost:5000
echo 🌐 Frontend: http://localhost:3000
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause > nul
