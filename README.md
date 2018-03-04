# Picosix Static

> Serve an image at different size / resolution depending on user request

## Demo

You can visi my demo site at [Static Demo](http://static-client.picosix.info/)

## Installing / Getting started

### Development

We need to run nginx server for API to render cache image and NodeJS server for transform image to difference image sizes (cache image).

* Run Mongo database `$ docker run -d --restart always --name mongo -p 27017:27017 -v $(pwd)/db:/backup mongo:3`
* Run Nginx proxy `$ docker run -d --restart always --name nginx-proxy -p 80:80 -p 443:443 -v $(pwd)/certs:/etc/nginx/certs -v /var/run/docker.sock:/tmp/docker.sock:ro picosix/nginx-proxy`
* Run API Server`$ docker run -d --restart always --name p6-static-api -v $(pwd)/api:/app --link mongo:db picosix/node yarn dev`
* Run Nginx's API `$ docker run -d -e VIRTUAL_HOST=static-api.picosix.info --restart always --name p6-static-api-nginx -v $(pwd)/docker/api:/etc/nginx/conf.d/ -v $(pwd)/api:/app --link p6-static-api:p6_static_api picosix/nginx`
* Run Client Server `$ docker run -d -e VIRTUAL_HOST=static-client.picosix.info --restart always --name p6-static-client-nginx -v $(pwd)/client:/app --link p6-static-api:p6_static_api picosix/node-alpine yarn start`

### Production

* Run Mongo database `$ docker run -d --restart always --name mongo -p 27017:27017 -v $(pwd)/db:/backup mongo:3`
* Run Nginx proxy `$ docker run -d --restart always --name nginx-proxy -p 80:80 -p 443:443 -v $(pwd)/certs:/etc/nginx/certs -v /var/run/docker.sock:/tmp/docker.sock:ro picosix/nginx-proxy`
* Run API Server`$ docker run -d --restart always --name p6-static-api -v $(pwd)/api:/app --link mongo:db picosix/node yarn start`
* Run Nginx's API `$ docker run -d -e VIRTUAL_HOST=static-api.picosix.info --restart always --name p6-static-api-nginx -v $(pwd)/docker/api:/etc/nginx/conf.d/ -v $(pwd)/api:/app --link p6-static-api:p6_static_api picosix/nginx`
* Run Client server `$ docker run -d -e VIRTUAL_HOST=static-client.picosix.info --restart always --name p6-static-client-nginx -v $(pwd)/docker/client:/etc/nginx/conf.d/ -v $(pwd)/client/build:/usr/share/nginx/html picosix/nginx`

## Licensing

MIT License

Copyright (c) 2017 PicoSix

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
