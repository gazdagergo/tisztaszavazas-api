import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default (req, res, next) => {
 	if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
		req.user = { name: 'admin', roles: [ process.env.LOCALHOST_ROLE || 'admin' ] };
		return next();
	}

	const token = req.headers.authorization;	

	if (token) {
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) {
				res.status(403);
				return res.json({ error: 'Authorization token is invalid.' });
			}
			req.user = user;
			next();
		});
	} else {
		res.status(401);
		return res.json({ error: 'Authorization token is missing.' });
	}
};
