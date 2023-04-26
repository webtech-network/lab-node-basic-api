const express = require ('express')
const routerClient = express.Router()

routerClient.use (express.static('public', {
  etag : false,
  index: ["index.html", "index.php"]
}))

module.exports = routerClient