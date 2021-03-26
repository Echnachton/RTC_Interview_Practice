//Sockets
const express = require("express");
const app = express();
const port = process.env.PORT || 4444;
const pool = [];
const server = app.listen(port,_=>{
    console.log("API server up");
});
const io = require("socket.io")(server,{
    cors: {
        origin: "http://localhost:3000",
      }
});

io.on("connection", socket => {
    console.log(`Connected: ${socket.id}`);
    socket.on("registerRoom", data=>{
        pool.push(data);
        socket.join(data);
        io.emit("poolUpdate",pool);
    });
    socket.on("getPool", callback =>{
        callback(pool);
    });
    socket.on("join", data=>{
        socket.join(data);
    });
    socket.on("disconnect",_=>{
        console.log(`Disconnected: ${socket.id}`);
    });
});

//STUN server
const { PeerServer } = require("peer");
const peerServer = PeerServer({port:4445, path:"/"});