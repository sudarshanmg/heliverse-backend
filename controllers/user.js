const User = require("../models/User");

exports.getDomains = async (req, res) => {
	try {
		const uniqueCategories = await User.distinct("domain");
		res.json(uniqueCategories);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.getUsers = async (req, res) => {
	try {
		const query = {};

		// Search by name
		if (req.query.name) {
			const nameParts = req.query.name.split(" ");
			const nameRegex = new RegExp(req.query.name, "i");

			if (nameParts.length === 1) {
				query.$or = [{ first_name: nameRegex }, { last_name: nameRegex }];
			} else {
				query.first_name = new RegExp(nameParts[0], "i");
				query.last_name = new RegExp(nameParts[1], "i");
			}
		}

		// Filter by gender
		if (req.query.gender) {
			query.gender = req.query.gender;
		}

		// Filter by domain
		if (req.query.domains) {
			// Convert the comma-separated list of domains to an array
			const domains = req.query.domains.split(",");
			query.domain = { $in: domains };
		}

		// Filter by availability
		if (req.query.available !== undefined) {
			query.available = req.query.available;
		}

		// Pagination parameters
		const page = parseInt(req.query.page) || 1;
		const limit = 20;
		const skip = (page - 1) * limit;

		const totalUsers = await User.countDocuments(query);

		const users = await User.find(query).skip(skip).limit(limit);
		const totalPages = Math.ceil(totalUsers / limit);
		res.json({ users, totalPages, currentPage: page });
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.getUserById = async (req, res) => {
	try {
		const id = req.params.id;

		const user = await User.findOne({ id });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json(user);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.updateUserById = async (req, res) => {
	try {
		const id = req.params.id;
		const updatedUserData = req.body;

		// Find the user by customId and update the data
		const updatedUser = await User.findOneAndUpdate(
			{ id },
			updatedUserData,
			{ new: true } // returns the updated document
		);

		if (!updatedUser) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json(updatedUser);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.deleteUserById = async (req, res) => {
	try {
		const id = req.params.id;

		// Find the user by customId and delete it
		const deletedUser = await User.findOneAndDelete({ id });

		if (!deletedUser) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json({ message: "User deleted successfully", user: deletedUser });
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.postAddUser = async (req, res, next) => {
	const id = req.body.id;
	const first_name = req.body.first_name;
	const last_name = req.body.last_name;
	const email = req.body.email;
	const gender = req.body.gender;
	const avatar = req.body.avatar;
	const domain = req.body.domain;
	const available = req.body.available;

	const user = new User({
		id,
		first_name,
		last_name,
		email,
		gender,
		avatar,
		domain,
		available,
	});

	user
		.save()
		.then((result) => {
			console.log("Added user");
			res.send(result);
		})
		.catch((err) => {
			console.log(err);
		});
};
