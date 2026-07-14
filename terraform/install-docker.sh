#!/bin/bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-v2
git clone https://github.com/emmaoluga-sketch/Smartcomply-Transaction-Monitoring-Platform.git
cd Smartcomply-Transaction-Monitoring-Platform
docker compose up -d