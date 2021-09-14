const server = require("./server")
const p = 8888;

console.log("server",server);
server.listen(p,()=> {
    console.log("runnin on port: ",p);
})