![Picosix](./document/static/logo.png)

# p6-static

> Serve an image at different size / resolution depending on user request

Description: updating ...

## Contributors

* Maintainer picosix <mailto:picosix.com@gmail.com>

Updating ...

## Installing / Getting started

### Quick start for dev

1. Clone project

* Using SSH `git clone git@github.com:picosix/p6-static.git`
* Using HTTPS: `git clone https://github.com/picosix/p6-static.git`

2. Run docker containers

* Mongo database `$ docker run -d --restart always --name mongo -p 27017:27017 -v $(pwd)/backup:/backup mongo:3`
* Nginx proxy `$ docker run -d --restart always --name nginx-proxy -p 80:80 -p 443:443 -v $(pwd)/certs:/etc/nginx/certs -v /var/run/docker.sock:/tmp/docker.sock:ro picosix/nginx-proxy`
* Node app `$ docker run -d -e SERVICE_HOST=static.picosix.p6app -e DB_DATABASE=picosix --restart always --name p6-static-node -v $(pwd):/app --link mongo:mongo picosix/node yarn start`
* Nginx server `$ docker run -d -e VIRTUAL_HOST=static.picosix.p6app --restart always --name p6-static-nginx -v $(pwd)/docker/nginx:/etc/nginx/conf.d/ -v $(pwd):/app --link p6-static-node:p6_static_node picosix/nginx`

## Developing

### Built With

* NodeJS v9.3.0
* ExpressJS v4.16.2
* SharpJS v0.18.4
* Lowdb v1.0.0

### Prerequisites

* Docker v17 or higher
* NodeJS v9 or higher

### Deploying / Publishing

Updating ...

## Versioning

`0.0.1`

## Configuration

Updating ...

## Style guide

We use [airbnb](https://github.com/airbnb/javascript) style and [prettier](https://github.com/prettier/prettier) to format code

## Api Reference

Updating ...

## Database

* [Lowdb](https://github.com/typicode/lowdb) v1.0.0

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
