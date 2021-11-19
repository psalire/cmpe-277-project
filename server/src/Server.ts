
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import iReverseGeocodeAPI from "./iReverseGeocodeAPI";
import BigCloudDataAPI from "./BigCloudDataAPI";
import MapboxAPI from "./MapboxAPI";
import { createServer } from "http";
import { Server as SocketIOServer, Socket as SocketIOSocket } from "socket.io";
import passport from "passport";
import AuthRoutes from "./AuthRoutes";

export default class Server {
    private static readonly app: express.Application = express();
    private static isStarted: boolean = false;

    private constructor() { }

    public static start(geocodeAPI = "mapbox", port = 8000): void {

        if (Server.isStarted) {
            console.warn("start() called even though already started");
            return;
        }

        // Express initialization
        Server.app.use(express.json());
        Server.app.use(cookieParser());
        Server.app.use(session({ secret: "mys3cr37", resave: false, saveUninitialized: false }));
        Server.app.use(passport.initialize());
        Server.app.use(passport.session());

        const httpServer = createServer(Server.app);
        var io = new SocketIOServer(httpServer, {
            serveClient: false
        });
        var rooms = new Map();
        var reverseGeocodeAPI: iReverseGeocodeAPI;
        switch (geocodeAPI.toLowerCase()) {
            case "mapbox":
                console.log("Using mapbox API...");
                reverseGeocodeAPI = new MapboxAPI();
                break;
            default:
            case "bigdatacloud":
                console.log("Using bigdatacloud API...");
                reverseGeocodeAPI = new BigCloudDataAPI();
                break;
        }

        Server.app.all('*', (req, _, next) => {
            console.log(`[${req.ip}]: ${req.method} ${req.originalUrl}`);
            next();
        });

        Server.app.get("/reverse/:lat/:lon", async (req, res) => {
            console.log(req.params.lat);
            console.log(req.params.lon);
            return res.json(await reverseGeocodeAPI.reverseLatLon(
                req.params.lat, req.params.lon
            ));
        });

        Server.app.use("/auth", AuthRoutes);

        // Socket.io initialization
        io.on("connection", (socket: SocketIOSocket) => {

            console.log(`socket ${socket.id} connected!`);

            socket.on("joinRoom", (data) => {
                let prevRoom = rooms.get(socket.id);
                if (prevRoom) {
                    console.log(`leaving ${prevRoom}`);
                    socket.leave(prevRoom);
                }
                else {
                    console.log("no prevRoom");
                }
                console.log(`${socket.id} joining ${data}`);
                rooms.set(socket.id, data);
                socket.join(data);
                // socket.to(data).emit("userConnect", `${socket.id}`);
                socket.to(data).emit("userConnect", "anon");
            });
            socket.on("disconnect", () => {
                console.log(`socket ${socket.id} disconnected!`);
            });
            socket.on("msg", (msg) => {
                let room = rooms.get(socket.id);
                if (room) {
                    console.log(`emitting ${msg} to ${Array.from(socket.rooms)}`);
                    socket.to(room).emit("msg", msg);
                }
                else {
                    console.log("no room, skipping");
                }
            });
        });

        // Start server
        httpServer.listen(port, () => {
            console.log(`Listening at http://localhost:${port}`);
            Server.isStarted = true;
        });
    }

}
