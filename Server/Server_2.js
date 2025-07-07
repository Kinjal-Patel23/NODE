const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200,{'Content-Type' : 'text/html'});
    res.end('<i>Hello World</i>');
})

server.listen(8080,() => {
    console.log("localhost:8080");
})