# p6-cdn

> Serve an image at different size / resolution depending on user request

## Build docker images

```shell
$ docker build --force-rm -t picosix/node-nginx -f docker/p6-node-nginx $(pwd)/docker
```

## Run docker service

```shell
$ docker run -d --restart always --name nginx-proxy -p 80:80 -p 443:443 -v $(pwd)/certs:/etc/nginx/certs -v /var/run/docker.sock:/tmp/docker.sock:ro jwilder/nginx-proxy
$ docker run -e VIRTUAL_HOST=static.picosix.local -d --restart always --name p6-static -v $(pwd):/app -v $(pwd)/docker/nginx:/etc/nginx/conf.d/ picosix/node-nginx yarn start-dev && docker exec -d p6-static nginx
```
