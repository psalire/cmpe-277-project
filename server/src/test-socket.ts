
import { io as SocketIOClient } from "socket.io-client";

const client = SocketIOClient("http://localhost:8000");

client.on("connect", () => {
    console.log("connected!");
    client.emit("msg", "hello world");
})

client.on("msg", (msg) => {
    console.log(msg)
});

client.on("error", (error) => {
    console.log(error);
})
