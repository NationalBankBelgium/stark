#!/bin/bash

echo " *_*_*_*_*_* DOCKERFILE AND KUBERNETES *_*_*_*_*_* "

echo ""
echo " Do you use docker ? [(y)es - (n)o ] "
read rep
if [ $rep == 'Y' ] || [ $rep == 'y' ] || [ $rep == 'yes' ]
then 
	cd docker
	./Dockerfile.sh
	cd ..
fi

echo ""
echo " Do you use kubernetes ? [(y)es - (n)o ] "
read rep
if [ $rep == 'Y' ] || [ $rep == 'y' ] || [ $rep == 'yes' ]
then
	cd kubernetes
	./kubernetes_deployement.sh
	cd ..
fi

echo " END OF EXECUTION ! "

