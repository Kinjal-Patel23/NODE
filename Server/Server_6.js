const http = require("http");

const server = http.createServer((req, res) => {
    res.end("Hiii Everyone...");
});

server.listen(5000, () => {
    console.log("localhost:5000");
});