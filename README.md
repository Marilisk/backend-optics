nohup node index.js &


# создать image
docker build . -t optics-api

# запустить контейнер из созданного ранее image
docker run -p 80:3443 -d optics-api

