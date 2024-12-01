@echo off

docker-compose down
docker-compose rm -vf
docker-compose up --build -V