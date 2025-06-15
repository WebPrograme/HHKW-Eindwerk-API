import { firestore, Timestamp } from './config/firebase';
import type { LogEntry } from './types';

// Add a log entry to the Logs collection
const addLog = async (action: string, description: string, deepInfo: {} = {}, request?: any): Promise<void> => {
	// If a request object is provided, check if it has a user
	if (request && request.body.user) {
		deepInfo = { ...deepInfo, User: request.body.user.name };
	}

	const log: LogEntry = {
		CreatedAt: Timestamp.fromDate(new Date()),
		ExpiryDate: Timestamp.fromDate(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30)), // 30 days expiry
		Action: action,
		Description: description,
		DeepInfo: deepInfo || {},
	};

	await firestore.collection('Logs').add(log);
};

// Get all logs
const getAllLogs = async (page: number, size: number): Promise<{ logs: LogEntry[]; totalCount: number }> => {
	// Get logs from the Logs collection, ordered by CreatedAt in descending order
	const logsRef = firestore
		.collection('Logs')
		.orderBy('CreatedAt', 'desc')
		.limit(size)
		.offset(page * size);
	const snapshot = await logsRef.get();
	const logs: LogEntry[] = [];

	snapshot.forEach((doc: any) => {
		logs.push({ id: doc.id, ...doc.data() });
	});

	const totalLogs = await firestore.collection('Logs').get();
	const totalCount = totalLogs.size;

	return { logs, totalCount };
};

// Get a log by ID
const getLog = async (logId: string): Promise<LogEntry | null> => {
	const logRef = firestore.collection('Logs').doc(logId);
	const log = await logRef.get();

	if (!log.exists) {
		return null;
	}

	return { id: log.id, ...log.data() };
};

// Export functions
export default { addLog, getAllLogs, getLog };
