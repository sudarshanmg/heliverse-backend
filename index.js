const express = require("express");
const cors = require("cors");
require("dotenv/config");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 8000;

const usersRoute = require("./api/users.routes");
const teamsRoute = require("./api/teams.routes");

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRoute);
app.use("/api/teams", teamsRoute);

app.get("/", (req, res) => {
	res.send("We are on home");
});

mongoose
	.connect(process.env.DATABASE_URI)
	.then((value) => {
		app.listen(PORT, () => {
			console.log(`Listening on port ${PORT}...`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
