@echo off

set currentpath=%~dp0 
cd %~dp0

echo *_*_*_*_*_* DOCKERFILE AND KUBERNETES *_*_*_*_*_* 

echo 
echo Do you use docker ? [(y)es - (n)o ] 

set /p rep1 = " Answer : "

:docker
if /i "%rep1%" == "y" || "%rep% == "yes" goto :doc
if /i "%rep1%" == "n" || "%rep% == "no" goto :kubernetes
if /i "%rep1% == "" goto :docker

:doc
	cd docker
	call Dockerfile.bat
	cd ..
	goto :kubernetes


:kubernetes

echo Do you use kubernetes ? [(y)es - (n)o ] 
set /p rep1 = " Answer : "

if /i "%rep2%" == "y" || "%rep% == "yes" goto :k8s
if /i "%rep2%" == "n" || "%rep% == "no" goto :end
if /i "%rep2% == "" goto :kubernetes

:k8s
	cd kubernetes
	call kubernetes_deployement.bat
	cd ..


:end 
echo END OF EXECUTION !

pause