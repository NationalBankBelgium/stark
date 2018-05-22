#!/bin/bash 

echo "*_*_*_*_*_* Script for automatic deployment of the chosen project via Kubernetes *_*_*_*_*_* "
echo " ******* MENU ******* "
echo " (1) Deploy a pod, service, ... "
echo " (2) Edit a file "
echo " (3) Exit "
echo " Choice : "
read choice

while [ $choice != 3 ]
do 
	if [ $choice == 1 ]
	then
		echo " -_- DEPLOY A POD, SERVICE, ... -_- "
		echo " Enter the name of the file you want to deploy : "
		echo "					(1) stark-start "
		echo "					(2) stark-start-monitor "
		echo "					(3) stark-dev "
		echo "					(4) stark-dev-monitor "
		echo "					(5) stark-prod "
		echo "					(6) Go to menu "
		echo " Number : "
		read rep1
		
		while [ $rep1 != 6 ]
		do
			if [ $rep1 == 1 ]
			then
				kubectl create -f stark-start.yml
				kubectl create -f stark-start_RS.yml
				kubectl create -f stark-start_HS.yml
			elif [ $rep1 == 2 ]
			then
				kubectl create -f stark-start-monitor.yml
				kubectl create -f stark-start-monitor_RS.yml
				kubectl create -f stark-start-monitor_HS.yml
			elif [ $rep1 == 3 ]
			then
				kubectl create -f stark-dev.yml
				kubectl create -f stark-dev_RS.yml
				kubectl create -f stark-dev_HS.yml
			elif [ $rep1 == 4 ]
			then
				kubectl create -f stark-dev-monitor.yml
				kubectl create -f stark-dev-monitor_RS.yml
				kubectl create -f stark-dev-monitor_HS.yml
			elif [ $rep1 == 5 ]
			then
				kubectl create -f stark-prod.yml
				kubectl create -f stark-prod_RS.yml
				kubectl create -f stark-prod_HS.yml
			fi
				echo " -_- DEPLOY A POD, SERVICE, ... -_- "
				echo " Enter the name of the file you want to deploy : "
				echo "					(1) stark-start "
				echo "					(2) stark-start-monitor "
				echo "					(3) stark-dev "
				echo "					(4) stark-dev-monitor "
				echo "					(5) stark-prod "
				echo "					(6)  Go to menu "
				echo " Number : "
				read rep1
		done
	elif [ $choice == 2 ]
	then
		echo "Enter the name of the file you want to edit :"
		echo "					(1) stark-start "
		echo "					(2) stark-start-monitor "
		echo "					(3) stark-dev "
		echo "					(4) stark-dev-monitor "
		echo "					(5) stark-prod "
		echo "					(6) Go to menu "
		echo " Number : "
		read rep2
		
		while [ $rep2 != 6 ]
		do
			if [ $rep2 == 1 ]
			then
				echo "				(1) stark-start.yml "
				echo "				(2) stark-start_RS.yml "
				echo "				(3) stark-start_HS.yml "
				echo "				(4) Go Back "
				echo " Number : "
				read rep3
				while [ $rep3 != 4 ]
				do
					if [ $rep3 == 1 ]
					then 
						nano stark-start.yml
					elif [ $rep3 == 2 ]
					then 
						nano stark-start_RS.yml
					elif [ $rep3 == 3 ]
					then 
						nano stark-start_HS.yml
					fi
						echo "				(1) stark-start.yml "
						echo "				(2) stark-start_RS.yml "
						echo "				(3) stark-start_HS.yml "
						echo "				(4) Go Back "
						echo " Number : "
						read rep3
				done
			elif [ $rep2 == 2 ]
			then
				echo "				(1) stark-start-monitor.yml "
				echo "				(2) stark-start-monitor_RS.yml "
				echo "				(3) stark-start-monitor_HS.yml "
				echo "				(4) Go Back "
				echo " Number : "
				read rep3
				while [ $rep3 != 4 ]
				do
					if [ $rep3 == 1 ]
					then 
						nano stark-start-monitor.yml
					elif [ $rep3 == 2 ]
					then 
						nano stark-start-monitor_RS.yml
					elif [ $rep3 == 3 ]
					then 
						nano stark-start-monitor_HS.yml
					fi
						echo "				(1) stark-start-monitor.yml "
						echo "				(2) stark-start-monitor_RS.yml "
						echo "				(3) stark-start-monitor_HS.yml "
						echo "				(4) Go Back "
						echo " Number : "
						read rep3
				done
			elif [ $rep2 == 3 ]
			then
				echo "				(1) stark-dev.yml "
				echo "				(2) stark-dev_RS.yml "
				echo "				(3) stark-dev_HS.yml "
				echo "				(4) Go Back "
				echo " Number : "
				read rep3
				while [ $rep3 != 4 ]
				do
					if [ $rep3 == 1 ]
					then 
						nano stark-dev.yml
					elif [ $rep3 == 2 ]
					then 
						nano stark-dev_RS.yml
					elif [ $rep3 == 3 ]
					then 
						nano stark-dev_HS.yml
					fi
						echo "				(1) stark-dev.yml "
						echo "				(2) stark-dev_RS.yml "
						echo "				(3) stark-dev_HS.yml "
						echo "				(4) Go Back "
						echo " Number : "
				done
			elif [ $rep2 == 4 ]
			then
				echo "				(1) stark-dev-monitor.yml "
				echo "				(2) stark-dev-monitor_RS.yml "
				echo "				(3) stark-dev-monitor_HS.yml "
				echo "				(4) Go Back "
				echo " Number : "
				read rep3
				while [ $rep3 != 4 ]
				do
					if [ $rep3 == 1 ]
					then 
						nano stark-dev-monitor.yml
					elif [ $rep3 == 2 ]
					then 
						nano stark-dev-monitor_RS.yml
					elif [ $rep3 == 3 ]
					then 
						nano stark-dev-monitor_HS.yml
					fi
						echo "				(1) stark-dev-monitor.yml "
						echo "				(2) stark-dev-monitor_RS.yml "
						echo "				(3) stark-dev-monitor_HS.yml "
						echo "				(4) Go Back "
						echo " Number : "
				done
			elif [ $rep2 == 5 ]
			then
				echo "				(1) stark-prod.yml "
				echo "				(2) stark-prod_RS.yml "
				echo "				(3) stark-prod_HS.yml "
				echo "				(4) Go Back "
				echo " Number : "
				read rep3
				while [ $rep3 != 4 ]
				do
					if [ $rep3 == 1 ]
					then 
						nano stark-prod.yml
					elif [ $rep3 == 2 ]
					then 
						nano stark-prod_RS.yml
					elif [ $rep3 == 3 ]
					then 
						nano stark-prod_HS.yml
					fi
						echo "				(1) stark-prod.yml "
						echo "				(2) stark-prod_RS.yml "
						echo "				(3) stark-prod_HS.yml "
						echo "				(4) Go Back "
						echo " Number : "
				done
			fi
				echo "Enter the name of the file you want to edit :"
				echo "					(1) stark-start "
				echo "					(2) stark-start-monitor "
				echo "					(3) stark-dev "
				echo "					(4) stark-dev-monitor "
				echo "					(5) stark-prod "
				echo "					(6) Go to menu "
				echo " Number : "
				read rep2
		done
	fi
		echo " ******* MENU ******* "
		echo " (1) Deploy a pod, service, ... "
		echo " (2) Edit file "
		echo " (3) Exit "
		echo " Choice : "
		read choice	
done
echo " End of execution ! "

