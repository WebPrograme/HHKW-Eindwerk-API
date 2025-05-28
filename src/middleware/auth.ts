import { auth } from '../config/firebase';
import { Request, Response, NextFunction } from 'express';

const validateToken = async (req: Request, res: Response, next: NextFunction) => {
	if (!req.headers.authorization) {
		res.status(401).send('No token provided').end();
		return;
	}

	const uid = req.headers.authorization.split(' ')[1];

	auth.verifyIdToken(uid)
		.then((result: any) => {
			if (result.email === 'yarne.gooris@gmail.com') {
				req.body.user = result;
				next();
			} else {
				res.status(401).send('Unauthorized').end();
			}
		})
		.catch((error: any) => {
			res.status(500).send({ error: error.message }).end();
		});
};

export default { validateToken };
