@echo off
cd /d %~dp0
rd /s /q dist
mkdir dist
..\InnoCompiler\ISCC.exe Setup.iss
..\InnoCompiler\ISCC.exe Setup.System.iss
..\InnoCompiler\ISCC.exe Setup.User.iss
move *.exe dist
timeout /t 10