# Khởi tạo api server với ExpressJS

## Khởi tạo project và cài đặt ExpressJS

* Tạo thư mục vào khởi tạo project

```shell
$ mkdir p6-static
$ cd p6-static
$ yarn init
```

* Sau câu lệnh `$ yarn init` thì bạn cần trả lời vài câu hỏi cho project. Bạn có thể chỉ việc nhấn Enter cho đến khi xong. Output có thể như thế này (tuỳ vào bạn xài yarn hay npm)

```shell
yarn init v1.3.2
question name (p6-static):
question version (1.0.0): 0.0.1
question description: Serve an image at different size / resolution depending on user request Edit
question entry point (index.js):
question repository url: git@github.com:picosix/p6-static.git
question author: TuanNguyen
question license (MIT):
question private:
success Saved package.json
Done in 39.59s.
```

* Bây giờ bạn sẽ có một file `package.json` trong project của bạn (với mình là `~/projects/p6-static/package.json`). Tiếp theo bạn cần cài `ExpressJS`

```shell
$ yan add express
```

* Tạo file `index.js` để khởi tạo server đầu tiên của bạn.

```javascript
const express = require('express');

const app = express();

// Routes
const packageJson = require('../package.json');
// Root
app.get('/', (req, res) =>
  res.json(
    _.pick(packageJson, ['name', 'version', 'description', 'author', 'license'])
  )
);

const port = process.env.PORT || 9999;
app.listen(port);
```

* Giờ chạy server của bạn bằng câu lệnh

```shell
$ node index.js
```

và truy cập địa chỉ `http://localhost:9999` bạn sẽ thấy output

```json
{
  "name": "p6-static",
  "version": "0.0.1",
  "description":
    "Serve an image at different size / resolution depending on user request",
  "author": "TuanNguyen",
  "license": "MIT"
}
```
