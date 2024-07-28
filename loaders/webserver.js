const express = require("express");
const expressStaticGzip = require("express-static-gzip");
const http = require("http");
const socketio = require("socket.io");
const helmet = require("helmet");
const requestIp = require("request-ip");
const { join } = require("path");
const { appendFile } = require("fs");
const middleWares = require("../config/rateLimit.js");
const route = require("./route.js");

const app = express();
const server = http.createServer(app);
global.io = socketio(server);

require("./socketEvents.js");
require("../utils/currentDateTime.js");
require("../utils/logError.js");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const port = process.env.port || 3000;

app.use(middleWares);
app.use(helmet({
	contentSecurityPolicy: false,
	nosniff: true,
	xssFilter: true,
	hsts: { maxAge: 31536000, includesSubDomains: true }
}));

app.use(function(req, res, next){
	res.setHeader("Content-Security-Policy", "frame-ancestors 'self';");
	next();
})

app.use(requestIp.mw());

app.use((req, res, next) => {
	//const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
	const ip = req.clientIp; // we will probably need to change this because nginx and proxying
	appendFile("Logs/ipLog.txt", `[${new Date()}] Client IP: ${ip}\n`, (error) => {
		if(error) console.error("Could not write ip to logfile", error);
	});
	next();
});

// app.set("trust proxy", true);

app.use("/", route);

app.use("/", expressStaticGzip(join(__dirname, "../client/public"), { //OMG i love this so much
	enableBrotli: true,
	orderPreference: ["br", "gzip"],
	cacheControl: true,
	immutable: true,
	maxAge: "30d"
}));

app.use(function(req, res) {
	res.sendFile(join(__dirname, "../client/public/html/index.html")); // ifthe user gives an invalid resource, they will still get the main page
});

server.listen((port), async () => {
	console.log(`Hanging onto dear life at ${process.pid}\nCurrently listening at http://localhost:${port}!`);
});
