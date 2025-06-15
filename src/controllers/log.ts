import { Request, Response } from 'express';
import Log from '../log';

// Get all logs
const getAllLogs = async (req: Request, res: Response) => {
	const logs = await Log.getAllLogs(parseInt(req.query.page as string) || 0, parseInt(req.query.size as string) || 50);

	res.status(200).send(logs);
};

// Get log by ID
const getLog = async (req: Request, res: Response) => {
	const logId = req.params.id;
	const log = await Log.getLog(logId);

	if (!log) {
		return res.status(404).send('Log not found');
	}

	res.status(200).send(log);
};

// Export functions
export default { getAllLogs, getLog };
