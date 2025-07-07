const http = require("http");
let  url = require('url');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type' : 'text/html'});
  let q = url.parse(req.url, true).query;
  let text = q.year + " " + q.month;
  res.end(text);
})

server.listen(3000,() => {
  console.log("localhost:3000");
})