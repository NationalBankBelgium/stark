@echo off

echo *_*_*_*_*_* Script allowing the automatic creation of the chosen project via the associated dockerfile *_*_*_*_*_*

set currentpath=%~dp0 
cd %~dp0

echo *_*_*_*_*_* We must be careful to enter the address of the private register *_*_*_*_*_*
::
:::: It is necessary to adapt the script according to the address of the private register
::
set registre=registre.domaine.lan:5000

docker login %registre%

echo Enter the name of the image you want to create :
echo (1) stark-start 
echo (2) stark-start:monitor 
echo (3) stark-dev
echo (4) stark-dev:monitor
echo (5) stark-prod

set /p rep= "Number : " 

if /i "%rep%" == "1" goto :start
if /i "%rep%" == "2" goto :start-monitor 
if /i "%rep%" == "3" goto :dev 
if /i "%rep%" == "4" goto :dev-monitor
if /i "%rep%" == "5" goto :prod
if /i "%rep%" < "5" || "%rep%" > "0" goto :end

:start
docker build -t stark-start . -f ./stark-start/Dockerfile-start
docker push %registre%/stark-start
goto :end

:start-monitor
docker build -t stark-start-monitor . -f ./stark-start-monitor/Dockerfile-start-monitor
docker push %registre%/stark-start-monitor
goto :end

:dev
docker build -t stark-dev . -f ./stark-dev/Dockerfile-dev
docker push %registre%/stark-dev
goto :end

:dev-monitor
docker build -t stark-dev-monitor . -f ./stark-dev-monitor/Dockerfile-dev-monitor
docker push %registre%/stark-dev-monitor
goto :end

:prod
docker build -t stark-prod . -f ./stark-prod/Dockerfile-prod
docker push %registre%/stark-prod
goto :end

:end
echo "End Of Execution !"

pause
