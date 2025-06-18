@echo off
echo Iniciando servidor Dota2-GSI...

:: Abre terminal rodando o servidor
start "Servidor" cmd /k "cd /d E:\dota2-gsi-master && node index.js"

timeout /t 2 /nobreak > nul

echo Iniciando frontend...

:: Abre terminal rodando o npm run dev
start "Frontend" cmd /k "cd /d svelte-app && npm run dev"

echo Tudo iniciado!
