@echo off
chcp 65001 >nul
title KNGL RUST Baslatici

echo =========================================
echo Sistem Temizleniyor (Eski sunucular kapatiliyor)...
echo =========================================
taskkill /F /IM node.exe /T >nul 2>&1

echo.
echo =========================================
echo Node.js Arka Plan Sunucusu Baslatiliyor...
echo =========================================
start "KNGL API Sunucusu (KAPATMAYIN)" cmd /k "color 0C && echo ======================================== && echo BU PENCEREYI KESINLIKLE KAPATMAYIN! && echo Eger kapatirsaniz, sitedeki veriler (kisi sayisi vs) guncellenmez. && echo Arka planda acik kalmasi gerekiyor. && echo ======================================== && echo. && node server.js"

echo.
echo =========================================
echo 2 Saniye icinde site tarayicida acilacak...
echo =========================================
timeout /t 2 /nobreak >nul
start index.html
