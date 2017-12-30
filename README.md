# p6-cdn

> Serve an image at different size / resolution depending on user request

## Build docker images

- nodejs

```shell
$ docker build --force-rm -t picosix/node -f docker/p6-nginx-node $(pwd)/docker
```

## Run docker service

```shell
$ docker run -d --restart always --name nginx-proxy -p 80:80 -p 443:443 -v $(pwd)/certs:/etc/nginx/certs -v /var/run/docker.sock:/tmp/docker.sock:ro jwilder/nginx-proxy
$ docker run -e VIRTUAL_HOST=static.picosix.com -d --restart always --name p6-static -p 9999:9999 -v $(pwd):/app -v $(pwd)/docker/nginx:/etc/nginx/conf.d/ picosix/node yarn start-dev
```