const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
	createUser: async ({ userInput: { email, password } }) => {
		try {
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				throw new Error('User exists already.');
			}

			const hashedPassword = await bcrypt.hash(password, 12);

			const user = new User({
				email,
				password: hashedPassword,
			});

			const result = await user.save();
			return { ...result._doc, password: null, _id: result.id };
		} catch (err) {
			throw err;
		}
	},
	login: async ({ email, password }) => {
		const user = await User.findOne({ email: email });
		if (!user) {
			throw new Error('User does not exist!');
		}

		const isCorrectPassword = await bcrypt.compare(password, user.password);

		if (!isCorrectPassword) {
			throw new Error('Password is incorrect!');
		}
		const token = jwt.sign(
			{
				userId: user.id,
				email: user.email,
			},
			process.env.JWT_KEY,
			{
				expiresIn: '1h',
			}
		);
		return {
			userId: user.id,
			token,
			tokenExpiration: 1,
		};
	},
};
