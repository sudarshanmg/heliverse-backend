const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
	id: { type: Number, required: false, unique: true },
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	email: { type: String, required: true },
	gender: { type: String, required: true },
	avatar: { type: String, required: true },
	domain: { type: String, required: true },
	available: { type: Boolean, required: true },
});

// The following code generates a new unique id for each user
UserSchema.pre("save", async function (next) {
	try {
		if (!this.id) {
			// Generate a unique id if not provided
			let lastUser = await this.constructor.findOne(
				{},
				{},
				{ sort: { id: -1 } }
			);
			this.id = (lastUser && lastUser.id + 1) || 1;
		}

		next();
	} catch (error) {
		next(error);
	}
});

module.exports = mongoose.model("User", UserSchema);
