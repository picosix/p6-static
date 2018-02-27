# Picosix Static

## Development

- Run Client Server `$ docker run -d -e VIRTUAL_HOST=static-client.picosix.info --restart always --name p6-static-client -v $(pwd)/client:/app --link p6-static-api:p6_static_api picosix/node-alpine yarn start`

## Production

- Run Mongo database `$ docker run -d --restart always --name mongo -p 27017:27017 -v $(pwd)/db:/backup mongo:3`
- Run Nginx proxy `$ docker run -d --restart always --name nginx-proxy -p 80:80 -p 443:443 -v $(pwd)/certs:/etc/nginx/certs -v /var/run/docker.sock:/tmp/docker.sock:ro picosix/nginx-proxy`
- Run API Server`$ docker run -d --restart always --name p6-static-api -v $(pwd)/api:/app --link mongo:db picosix/node yarn start`
- Run Nginx's API `$ docker run -d -e VIRTUAL_HOST=static-api.picosix.info --restart always --name p6-static-api-nginx -v $(pwd)/docker/api:/etc/nginx/conf.d/ -v $(pwd)/api:/app --link p6-static-api:p6_static_api picosix/nginx`
- Run Client server `$ docker run -d -e VIRTUAL_HOST=static-client.picosix.info --restart always --name p6-static-client-nginx -v $(pwd)/docker/client:/etc/nginx/conf.d/  -v $(pwd)/client/build:/usr/share/nginx/html picosix/nginx`