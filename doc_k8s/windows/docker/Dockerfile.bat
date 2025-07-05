@echo off

set imageInfo=""
set currentpath=%~dp0 
cd %~dp0

echo *_*_*_*_*_* Script allowing the automatic creation of the chosen project via the associated dockerfile *_*_*_*_*_* 
echo *_*_*_*_*_* We must be careful to enter the address of the private register *_*_*_*_*_* 

echo Enter the repo's URL (blank by default) : 
set /p registre

if %registre% == "" 
(
	docker login
)
else
(
	docker login %registre%
	set /a "imageInfo=%registre%"
)

echo Please enter your username to build an image : 
set /p username

if %registre% == ""
(
	set /a "imageInfo=%username%"
)
else
(
	set /a "imageInfo+=/%username%"
)
:menu
echo ******* MENU *******
echo (1) Build an image
echo (2) Edit a file
echo (3) Exit 

set /p choice= " Choice : "

if /i "%choice%" == "1" goto :while1
if /i "%choice%" == "2" goto :while2
if /i "%choice%" == "3" goto :end
:: #####################################
:while1
	echo Enter the name of the image you want to create :
	echo (1) stark-start 
	echo (2) stark-start:monitor 
	echo (3) stark-dev
	echo (4) stark-dev:monitor
	echo (5) stark-prod
	echo (6) Go to menu

	set /p rep1= "Number : " 

	if /i "%rep1%" == "1" goto :start
	if /i "%rep1%" == "2" goto :start-monitor 
	if /i "%rep1%" == "3" goto :dev 
	if /i "%rep1%" == "4" goto :dev-monitor
	if /i "%rep1%" == "5" goto :prod
	if /i "%rep1%" > "5" || "%rep1%" < "0" goto :menu

	:start
	docker build -t stark-start . -f ./stark-start/Dockerfile-start
	docker push %imageInfo%/stark-start
	goto :while1

	:start-monitor
	docker build -t stark-start-monitor . -f ./stark-start-monitor/Dockerfile-start-monitor
	docker push %imageInfo%/stark-start-monitor
	goto :while1

	:dev
	docker build -t stark-dev . -f ./stark-dev/Dockerfile-dev
	docker push %imageInfo%/stark-dev
	goto :while1

	:dev-monitor
	docker build -t stark-dev-monitor . -f ./stark-dev-monitor/Dockerfile-dev-monitor
	docker push %imageInfo%/stark-dev-monitor
	goto :while1

	:prod
	docker build -t stark-prod . -f ./stark-prod/Dockerfile-prod
	docker push %imageInfo%/stark-prod
	goto :while1
	
:: #####################################"
:while2
	echo Enter the name of the file you want to edit :
	echo (1) Dockerfile-start "
	echo (2) Dockerfile-start-monitor "
	echo (3) Dockerfile-dev "
	echo (4) Dockerfile-dev-monitor "
	echo (5) Dockerfile-prod "
	echo (6) server.xml "
	echo (7) rewrite.config "
	echo (8) Go to menu "

	set /p rep2= "Number : " 

	if /i "%rep2%" == "1" goto :editstart
	if /i "%rep2%" == "2" goto :editstart-monitor 
	if /i "%rep2%" == "3" goto :editdev 
	if /i "%rep2%" == "4" goto :editdev-monitor
	if /i "%rep2%" == "5" goto :editprod
	if /i "%rep2%" == "6" goto :editserver
	if /i "%rep2%" == "7" goto :editrewrite
	if /i "%rep2%" > "7" || "%rep%" < "0" goto :menu
	
	:editstart
	start .\stark-start\Dockerfile-start
	goto :while1
	:editstart-monitor
	start .\stark-start-monitor\Dockerfile-start-monitor
	goto :while1
	:editdev
	start .\stark-dev\Dockerfile-dev
	goto :while1
	:editdev-monitor
	start .\stark-dev-monitor\Dockerfile-dev-monitor
	goto :while1
	:editprod
	start .\stark-prod\Dockerfile-prod
	goto :while1	
	:editserver
	start server.xml
	goto :while1
	:editrewrite
	start rewrite.config
	goto :while1
:: #####################################
:end
echo "End Of Execution !"

pause

