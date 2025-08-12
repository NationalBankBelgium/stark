#!/bin/bash

####################################################################################################
#				 								   #
# 				INSTALLATION SUR CHAQUE MACHINE					   #
#				 							 	   #
###################################################################################################

############################
#			   #
## Installation de Docker ##
#                          #
############################

echo " ***************** INSTALLATION DE DOCKER ***************** "

echo " Voulez-vous installer Docker ? (oui - non) : "
read rep  

if [ $rep == "oui" ] || [ $rep == "o" ]
then
	apt-get install -y apt-transport-https ca-certificates curl gnupg2 software-properties-common
	curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | apt-key add -
	add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian stretch stable"
	apt-get update
	apt-get install -y docker-ce

	echo '{ "exec-opts": ["native.cgroupdriver=cgroupfs"] }' > /etc/docker/daemon.json

fi

systemctl daemon-reload
service docker restart

################################
#                              #
## Installation de Kubernetes ##
#                              #
################################

echo " ***************** INSTALLATION DE KUBERNETES ***************** "

echo " Voulez-vous installer Kubernetes ? (oui - non) : "
read rep  

if [ $rep == "oui" ] || [ $rep == "o" ]
then
	apt-get update
	curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
	add-apt-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"
	apt-get update
	apt-get install -y kubelet kubeadm kubectl
fi

#########################################################
#                                                       #
## Configuration des drivers cgroup sur le Master Node ##
#                                                       #
#########################################################

echo " ***************** CONFIGURATION CGROUP ***************** "

docker info | grep -i cgroup
sed -i "s/cgroup-driver=systemd/cgroup-driver=cgroupfs/g" /etc/systemd/system/kubelet.service.d/10-kubeadm.conf

###################################
#                                 #
## Reinitialisation des services ##
#                                 #
###################################

echo " ***************** SERVICE RESET ***************** "

systemctl daemon-reload
systemctl restart kubelet

############################################
#                                          #
## Initialisation du Master / Minion Node ##
#                                          #
############################################


 echo " ***************** INITIALISATION MASTERNODE ***************** "
 kubeadm reset
 swapoff -a


echo " Cette machine est-elle un node master (oui - non) : "
read rep  

if [ $rep == "oui" ] || [ $rep == "o" ]
then
	echo " Entrer l'IP du reseau/mask (exemple : 192.168.154.0/28) : "
	read ip
	kubeadm init --pod-network-cidr=$ip

	mkdir -p $HOME/.kube
	cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
	chown $(id -u):$(id -g) $HOME/.kube/config
fi


