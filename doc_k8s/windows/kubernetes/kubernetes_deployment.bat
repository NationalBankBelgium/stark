@echo off

echo *_*_*_*_*_* Script for automatic deployment of the chosen project via Kubernetes *_*_*_*_*_* 

set currentpath=%~dp0 
cd %~dp0

:menu
echo ******* MENU *******
echo (1) Deploy an image
echo (2) Edit a file
echo (3) Exit 

set /p choice = " Choice : "

if /i "%choice%" == "1" goto :while1
if /i "%choice%" == "2" goto :while2
if /i "%choice%" == "3" goto :end
:: #####################################
:while1
	echo Enter the number of the file you want to deploy :
	echo (1) stark-start 
	echo (2) stark-start-monitor
	echo (3) stark-dev
	echo (4) stark-dev-monitor
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
		kubectl create -f stark-start.yml
		kubectl create -f stark-start_RS.yml
		kubectl create -f stark-start_HS.yml
	goto :while1

	:start-monitor
		kubectl create -f stark-start-monitor.yml
		kubectl create -f stark-start-monitor_RS.yml
		kubectl create -f stark-start-monitor_HS.yml
	goto :while1

	:dev
		kubectl create -f stark-dev.yml
		kubectl create -f stark-dev_RS.yml
		kubectl create -f stark-dev_HS.yml
	goto :while1

	:dev-monitor
		kubectl create -f stark-dev-monitor.yml
		kubectl create -f stark-dev-monitor_RS.yml
		kubectl create -f stark-dev-monitor_HS.yml
	goto :while1

	:prod
		kubectl create -f stark-prod.yml
		kubectl create -f stark-prod_RS.yml
		kubectl create -f stark-prod_HS.yml
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

	if /i "%rep2%" == "1" goto :loopstart
	if /i "%rep2%" == "2" goto :loopstart-monitor 
	if /i "%rep2%" == "3" goto :loopdev 
	if /i "%rep2%" == "4" goto :loopdev-monitor
	if /i "%rep2%" == "5" goto :loopprod
	if /i "%rep2%" > "5" || "%rep%" < "0" goto :menu
	
	:loopstart
	echo Edit : 
	echo (1) stark-start.yml
	echo (2) stark-start_RS.yml
	echo (3) stark-start_HS.yml
	echo (4) Go back !
	set /p rep21= "Number : " 
	
	if /i "%rep2%" == "1" goto :edit210
	if /i "%rep2%" == "2" goto :edit211
	if /i "%rep2%" == "3" goto :edit212
	if /i "%rep2%" > "3" || "%rep%" < "0" goto :while2 
	
		:edit210
		start stark-start.yml
		goto :loopstart
		:edit211
		start stark-start_RS.yml
		goto :loopstart
		:edit212
		start stark-start_HS.yml	
		goto :loopstart
	
	:loopstart-monitor
	echo Edit : 
	echo (1) stark-start-monitor.yml
	echo (2) stark-start-monitor_RS.yml
	echo (3) stark-start-monitor_HS.yml
	echo (4) Go back !
	set /p rep21= "Number : " 
	
	if /i "%rep2%" == "1" goto :edit220
	if /i "%rep2%" == "2" goto :edit221
	if /i "%rep2%" == "3" goto :edit222
	if /i "%rep2%" > "3" || "%rep%" < "0" goto :while2 
	
		:edit220
		start stark-start-monitor.yml
		goto :loopstart-monitor
		:edit221
		start stark-start-monitor_RS.yml
		goto :loopstart-monitor
		:edit222
		start stark-start-monitor_HS.yml
		goto :loopstart-monitor
		
	:loopdev
	echo Edit : 
	echo (1) stark-dev.yml
	echo (2) stark-dev_RS.yml
	echo (3) stark-dev_HS.yml
	echo (4) Go back !
	set /p rep21= "Number : " 
	
	if /i "%rep2%" == "1" goto :edit230
	if /i "%rep2%" == "2" goto :edit231
	if /i "%rep2%" == "3" goto :edit232
	if /i "%rep2%" > "3" || "%rep%" < "0" goto :while2 
	
		:edit230
		start stark-dev.yml
		goto :loopstart
		:edit231:loopstart
		start stark-dev_RS.yml
		goto :loopdev
		:edit232
		start stark-dev_HS.yml
		goto :loopdev
	
	:loopdev-monitor
	echo Edit : 
	echo (1) stark-dev-monitor.yml
	echo (2) stark-dev-monitor_RS.yml
	echo (3) stark-dev-monitor_HS.yml
	echo (4) Go back !
	set /p rep21= "Number : " 
	
	if /i "%rep2%" == "1" goto :edit240
	if /i "%rep2%" == "2" goto :edit241
	if /i "%rep2%" == "3" goto :edit242
	if /i "%rep2%" > "3" || "%rep%" < "0" goto :while2 
	
		:edit240
		start stark-dev-monitor.yml
		goto :loopdev-monitor
		:edit241
		start stark-dev-monitor_RS.yml
		goto :loopdev-monitor
		:edit242
		start stark-dev-monitor_HS.yml
		goto :loopdev-monitor
	
	:loopprod
	echo Edit : 
	echo (1) stark-prod.yml
	echo (2) stark-prod_RS.yml
	echo (3) stark-prod_HS.yml
	echo (4) Go back !
	set /p rep21= "Number : " 
	
	if /i "%rep2%" == "1" goto :edit250
	if /i "%rep2%" == "2" goto :edit251
	if /i "%rep2%" == "3" goto :edit252
	if /i "%rep2%" > "3" || "%rep%" < "0" goto :while2 
	
		:edit250
		start stark-prod.yml
		goto :loopprod
		:edit251
		start stark-prod_RS.yml
		goto :loopprod
		:edit252
		start stark-prod_HS.yml
		goto :loopprod
	
:: #####################################
:end
echo "End Of Execution !"

pause

