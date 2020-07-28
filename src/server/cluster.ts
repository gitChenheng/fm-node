import cluster from "cluster";
import http from "http";
import os from "os";
import "./index";

const numCpu = os.cpus().length;

if (cluster.isMaster){
    console.log(`master ${process.pid} starting`);
    for (let i = 0; i < numCpu; i++){
        cluster.fork();
    }
    cluster.on(`exit`, (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} exit`);
    })
} else{
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end(`hh`);
    }).listen(9090);

    console.log(`worker ${process.pid} start`);
}
