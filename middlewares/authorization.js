export default async (req, res, next) => {
	if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') return next()
	const authtokens = [
		process.env.TOKEN1,
		process.env.TOKEN2
	]
  if (!req.headers.authorization || !authtokens.includes(req.headers.authorization) ){
    res.status(401);
    return res.json({error: 'Authorization token is missing or incorrect'})
  } else {
		next()
	}
}