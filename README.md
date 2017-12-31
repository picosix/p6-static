# p6-cdn

> Serve an image at different size / resolution depending on user request

## Build docker images

```shell
$ docker build --force-rm -t picosix/node -f docker/p6-node $(pwd)/docker
$ docker build --force-rm -t picosix/nginx -f docker/p6-nginx $(pwd)/docker
```

## Run docker service

```shell
$ docker run -d --restart always --name nginx-proxy -p 80:80 -p 443:443 -v $(pwd)/certs:/etc/nginx/certs -v /var/run/docker.sock:/tmp/docker.sock:ro jwilder/nginx-proxy
$ docker run -d -e VIRTUAL_HOST=static.picosix.local --restart always --name p6-static-node -v $(pwd):/app picosix/node yarn start-dev
$ docker run -d -e VIRTUAL_HOST=static.picosix.local --restart always --name p6-static-nginx -v $(pwd)/docker/nginx:/etc/nginx/conf.d/ -v $(pwd):/app --link p6-static-node:p6_static_node picosix/nginx
```
