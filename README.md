nohup node index.js &


# создать image
docker build . -t optics-api

# запустить контейнер из созданного ранее image
docker run -p 80:5555 -d optics-api

