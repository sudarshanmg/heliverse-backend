const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

const teamSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	members: [teamMemberSchema],
});

module.exports = mongoose.model("Team", teamSchema);
