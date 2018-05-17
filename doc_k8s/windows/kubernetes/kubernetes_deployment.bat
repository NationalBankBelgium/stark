@echo off

echo *_*_*_*_*_* Script for automatic deployment of the chosen project via Kubernetes *_*_*_*_*_* 

set currentpath=%~dp0 
cd %~dp0

echo Enter the number of the file you want to deploy :
echo (1) stark-start 
echo (2) stark-start-monitor
echo (3) stark-dev
echo (4) stark-dev-monitor
echo (5) stark-prod

set /p rep= "Number : " 

if /i "%rep%" == "1" goto :start 
if /i "%rep%" == "2" goto :startmonitor 
if /i "%rep%" == "3" goto :dev 
if /i "%rep%" == "4" goto :devmonitor 
if /i "%rep%" == "5" goto :prod
if /i "%rep%" < "5" || "%rep%" > "0" goto :end
	
:start
kubectl create -f stark-start.yml
kubectl create -f stark-start_RS.yml
kubectl create -f stark-start_HS.yml
goto :end

:startmonitor
kubectl create -f stark-start-monitor.yml
kubectl create -f stark-start-monitor_RS.yml
kubectl create -f stark-start-monitor_HS.yml
goto :end

:dev
kubectl create -f stark-dev.yml
kubectl create -f stark-dev_RS.yml
kubectl create -f stark-dev_HS.yml
goto :end

:devmonitor
kubectl create -f stark-dev-monitor.yml
kubectl create -f stark-dev-monitor_RS.yml
kubectl create -f stark-dev-monitor_HS.yml
goto :end

:prod
kubectl create -f stark-prod.yml
kubectl create -f stark-prod_RS.yml
kubectl create -f stark-prod_HS.yml
goto :end

:end
echo "End Of Execution !"

pause

