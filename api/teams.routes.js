const express = require("express");
const router = express.Router();

const teamController = require("../controllers/team");

router.get("/", teamController.getTeams);

router.get("/:id", teamController.getTeamById);

router.post("/", teamController.postAddTeam);

module.exports = router;
