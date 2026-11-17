@echo off
title ToolTag Pro - Servidor RFID y Gamificacion
color 0B
echo =================================================================
echo           TOOLTAG PRO - GESTION DE HERRAMIENTAS RFID
echo =================================================================
echo.
echo Iniciando servidor backend y cargando base de datos...
cd /d "C:\Users\luisn\.gemini\antigravity\scratch\rfid-tool-manager"

:: Abrir navegador tras 2 segundos en segundo plano
start "" powershell -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:8000'"

:: Ejecutar servidor python
python run_server.py
pause
