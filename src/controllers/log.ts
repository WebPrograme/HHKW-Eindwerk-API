import { Request, Response } from 'express';
import Log from '../log';
import type { LogEntry, LogCollection } from '../types';

// Get all logs
const getAllLogs = async (req: Request, res: Response) => {
	const logs = await Log.getAllLogs(parseInt(req.query.page as string) || 0, parseInt(req.query.size as string) || 50);

	res.status(200).send(logs);
};

// Get logs with filtering
const getLogs = async (req: Request, res: Response) => {
	const page = parseInt(req.query.page as string) || 0;
	const size = parseInt(req.query.size as string) || 50;
	const collection = (req.query.collection as LogCollection | 'all') == 'all' ? undefined : (req.query.collection as LogCollection);
	let startTime: Date | undefined;
	let endTime: Date | undefined;

	if (req.query.startTime !== 'null' && req.query.startTime) {
		startTime = new Date(req.query.startTime as string);
		if (isNaN(startTime.getTime())) {
			return res.status(400).send('Invalid start time format');
		}
	}

	if (req.query.endTime !== 'null' && req.query.endTime) {
		endTime = new Date(req.query.endTime as string);
		if (isNaN(endTime.getTime())) {
			return res.status(400).send('Invalid end time format');
		}
	}

	const logs = await Log.getLogs(page, size, collection, startTime, endTime);

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
export default { getAllLogs, getLog, getLogs };
