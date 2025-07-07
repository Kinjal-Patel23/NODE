const http = require("http");

const server = http.createServer((req, res) => {
  res.write("Hello");
  res.end();
});

server.listen(8080,() => {
  console.log("localhost:8080");
})