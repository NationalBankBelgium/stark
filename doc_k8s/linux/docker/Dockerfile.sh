#!/bin/bash

imageInfo=""

echo "*_*_*_*_*_* Script allowing the automatic creation of the chosen project via the associated dockerfile *_*_*_*_*_*"
echo "*_*_*_*_*_* We must be careful to enter the address of the private register *_*_*_*_*_*"

echo " Enter the repo's URL (blank by default) : "
read registre

if [ -z "$registre" ]
then 
	docker login
else
	docker login $registre
	imageInfo="$registre"
fi

echo " Please enter your username to build an image : "
read username

if [ -z "$registre" ]
then
	imageInfo="$username"
else
	imageInfo+="/$username"
fi

echo " ******* MENU ******* "
echo " (1) Build an image "
echo " (2) Edit a file "
echo " (3) Exit "
echo " Choice : "
read choice

while [ $choice != 3 ]
do 
	if [ $choice == 1 ]
	then
		echo " -_- BUILD AN IMAGE -_- "
		echo " Enter the name of the image you want to create : "
		echo "				(1) stark-start " 
		echo "				(2) stark-start:monitor " 
		echo "				(3) stark-dev "
		echo "				(4) stark-dev:monitor "
		echo "				(5) stark-prod "
		echo "				(6) Go to menu "
		echo " Number : "
		read rep1
		
		while [ $rep1 != 6 ]
		do
			if [ $rep1 == 1 ]
			then
				docker build -t stark-start . -f ./stark-start/Dockerfile-start
				docker push $imageInfo/stark-start
			elif [ $rep1 == 2 ]
			then
				docker build -t stark-start-monitor . -f ./stark-start-monitor/Dockerfile-start-monitor
				docker push $imageInfo/stark-start-monitor
			elif [ $rep1 == 3 ]
			then
				docker build -t stark-dev . -f ./stark-dev/Dockerfile-dev
				docker push $imageInfo/stark-dev
			elif [ $rep1 == 4 ]
			then
				docker build -t stark-dev-monitor . -f ./stark-dev-monitor/Dockerfile-dev-monitor
				docker push $imageInfo/stark-dev-monitor
			elif [ $rep1 == 5 ]
			then
				docker build -t stark-prod . -f ./stark-prod/Dockerfile-prod
				docker push $imageInfo/stark-prod
			fi
				echo " -_- BUILD AN IMAGE -_- "
				echo " Enter the name of the image you want to build : "
				echo "				(1) stark-start " 
				echo "				(2) stark-start:monitor " 
				echo "				(3) stark-dev "
				echo "				(4) stark-dev:monitor "
				echo "				(5) stark-prod "
				echo "				(6) Go to menu "
				echo " Number : "
				read rep1
		done
	elif [ $choice == 2 ]
	then
		echo " -_- EDIT A FILE -_- "
		echo "Enter the name of the file you want to edit :"
		echo "				(1) Dockerfile-start "
		echo "				(2) Dockerfile-start-monitor "
		echo "				(3) Dockerfile-dev "
		echo "				(4) Dockerfile-dev-monitor "
		echo "				(5) Dockerfile-prod "
		echo "				(6) server.xml "
		echo "				(7) rewrite.config "
		echo "				(8) Go to menu "
		echo " Number : "
		read rep2
		
		while [ $rep2 != 8 ]
		do
			if [ $rep2 == 1 ]
			then
				nano ./stark-start/Dockerfile-start
				
			elif [ $rep2 == 2 ]
			then
				nano ./stark-start-monitor/Dockerfile-start-monitor
			elif [ $rep2 == 3 ]
			then
				nano ./stark-dev/Dockerfile-dev
			elif [ $rep2 == 4 ]
			then
				nano ./stark-dev-monitor/Dockerfile-dev-monitor
			elif [ $rep2 == 5 ]
			then
				nano ./stark-prod/Dockerfile-prod
			elif [ $rep2 == 6 ]
			then
				nano server.xml
			elif [ $rep2 == 7 ]
			then
				nano rewrite.config
			fi
				echo " -_- EDIT A FILE -_- "
				echo "Enter the name of the file you want to edit :"
				echo "				(1) Dockerfile-start "
				echo "				(2) Dockerfile-start-monitor "
				echo "				(3) Dockerfile-dev "
				echo "				(4) Dockerfile-dev-monitor "
				echo "				(5) Dockerfile-prod "
				echo "				(6) server.xml "
				echo "				(7) rewrite.config "
				echo "				(8) Go to menu "
				echo " Number : "
				read rep2
		done
	fi
		echo " ******* MENU ******* "
		echo " (1) Build image "
		echo " (2) Edit file "
		echo " (3) Exit "
		echo " Choice : "
		read choice	
done
echo " End of execution ! "

