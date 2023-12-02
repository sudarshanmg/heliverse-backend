const User = require("../models/User");
const Team = require("../models/Team");

// Route to insert a new team
exports.postAddTeam = async (req, res) => {
	try {
		const { name, memberUserIds } = req.body;

		console.log(name, memberUserIds);

		const users = await User.find({ _id: { $in: memberUserIds } });

		const uniqueDomains = new Set();
		for (const user of users) {
			if (!user.available || uniqueDomains.has(user.domain)) {
				return res
					.status(400)
					.json({ error: "Team members should belong to different domains" });
			}
			uniqueDomains.add(user.domain);
		}

		const newTeam = new Team({
			name: name,
			members: users.map((user) => ({ userId: user._id })),
		});

		const savedTeam = await newTeam.save();

		res.status(201).json(savedTeam);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Get all the teams

exports.getTeams = async (req, res) => {
	try {
		const { name } = req.query;
		let query = {};

		if (name) {
			query.name = { $regex: new RegExp(name, "i") };
		}

		const teams = await Team.find(query).populate({
			path: "members.userId",
			select: "first_name last_name email gender avatar domain available",
		});

		const teamDetails = teams.map((team) => ({
			name: team.name,
			members: team.members.map((member) => ({
				userId: member.userId._id,
				first_name: member.userId.first_name,
				last_name: member.userId.last_name,
				email: member.userId.email,
				gender: member.userId.gender,
				avatar: member.userId.avatar,
				domain: member.userId.domain,
				available: member.userId.available,
			})),
		}));

		res.json(teamDetails);
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Get teams by id

exports.getTeamById = async (req, res) => {
	try {
		const { id } = req.params;

		const team = await Team.findById(id).populate({
			path: "members.userId",
			select: "first_name last_name email gender avatar domain available",
		});

		if (!team) {
			return res.status(404).json({ error: "Team not found" });
		}

		const teamDetails = {
			name: team.name,
			members: team.members.map((member) => ({
				userId: member.userId._id,
				first_name: member.userId.first_name,
				last_name: member.userId.last_name,
				email: member.userId.email,
				gender: member.userId.gender,
				avatar: member.userId.avatar,
				domain: member.userId.domain,
				available: member.userId.available,
			})),
		};

		res.json(teamDetails);
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
