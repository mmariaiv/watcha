const express = require("express");
require("dotenv").config();
const { createServer } = require("http");
const { join } = require("path");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const bodyParser = require("body-parser");

const routes = require("./routes");
const { corsSettings } = require("./utils/constants");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { fetchAndSavePeriodically } = require("./updaters/movies");

const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: corsSettings,
});

app.use(cors(corsSettings));

mongoose.connect("mongodb://localhost:27017/watcha", {}).catch((err) => {
	console.log(err, "Произошла ошибка при попытке подключения к базе данных");
});

// fetchAndSavePeriodically();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use("/", routes);

io.on("connection", (socket) => {
	console.log("a user connected");

	socket.on("event", (count) => {
		io.emit("responseEvent", { message: "ok" });
		console.log("count is " + count);
	});

	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
	const { statusCode = 500, message } = err;

	res.status(statusCode).send({
		message: statusCode === 500 ? "На сервере произошла ошибка" : message,
	});
});

server.listen(3333, () => {
	console.log("server is running on port http://localhost:3333");
});
