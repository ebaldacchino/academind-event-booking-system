const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
	const token = req.get('Authorization');
	if (!token) {  
		req.isAuth = false;
		return next();
	}
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.JWT_KEY);
	} catch (err) {
		req.isAuth = false;
		return next();
	}
	if (!decodedToken) {
		req.isAuth = false;
		return next();
	}
	req.isAuth = true;
	req.userId = decodedToken.userId;
	next();
};
