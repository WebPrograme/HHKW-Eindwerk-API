import { firestore, Timestamp } from './config/firebase';
import type { LogEntry } from './types';

// Add a log entry to the Logs collection
const addLog = async (action: string, description: string, deepInfo: {} = {}, request?: any): Promise<void> => {
	// If a request object is provided, check if it has a user
	if (request && request.body.user) {
		deepInfo = { ...deepInfo, User: request.body.user.name };
	}

	// Determine the collection based on the action
	let collection: LogEntry['Collection'];
	switch (action) {
		case 'Blog Artikel Toegevoegd':
		case 'Blog Artikel Bijgewerkt':
		case 'Blog Artikelen Verwijderd':
			collection = 'BlogArticles';
			break;
		case 'Blog Event Toegevoegd':
		case 'Blog Event Bijgewerkt':
		case 'Blog Events Verwijderd':
			collection = 'BlogEvents';
			break;
		case 'Archief Artikel Toegevoegd':
		case 'Archief Artikel Bijgewerkt':
		case 'Archief Artikelen Verwijderd':
			collection = 'ArchiveArticles';
			break;
		case 'Sectie Toegevoegd':
		case 'Sectie Bijgewerkt':
		case 'Sectie Verwijderd':
			collection = 'Sections';
			break;
		case 'Publicatie Toegevoegd':
		case 'Publicatie Bijgewerkt':
		case 'Publicatie Verwijderd':
			collection = 'Publications';
			break;
		case 'Formulier Ingediend':
			collection = 'Forms';
			break;
		case 'Newsletter Geabonneerd':
		case 'Newsletter Afgemeld':
			collection = 'NewsletterSubscriptions';
			break;
		default:
			throw new Error(`Unknown action: ${action}`);
	}

	const log: LogEntry = {
		CreatedAt: Timestamp.fromDate(new Date()),
		ExpiryDate: Timestamp.fromDate(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30)), // 30 days expiry
		Collection: collection,
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

// Get logs by filtering
const getLogs = async (page: number, size: number, collection?: string, startTime?: Date, endTime?: Date): Promise<{ logs: LogEntry[]; totalCount: number }> => {
	const logsRefBase = firestore.collection('Logs').orderBy('CreatedAt', 'desc');

	let logsRef = logsRefBase.where('CreatedAt', '>=', startTime || new Date(0)).where('CreatedAt', '<=', endTime || new Date());

	if (collection && collection !== 'all') {
		logsRef = logsRef.where('Collection', '==', collection);
	}

	logsRef = logsRef.limit(size).offset(page * size);
	const snapshot = await logsRef.get();
	const logs: LogEntry[] = [];
	snapshot.forEach((doc: any) => {
		logs.push({ id: doc.id, ...doc.data() });
	});

	let totalLogsQuery = firestore
		.collection('Logs')
		.where('CreatedAt', '>=', startTime || new Date(0))
		.where('CreatedAt', '<=', endTime || new Date());

	if (collection && collection !== 'all') {
		totalLogsQuery = totalLogsQuery.where('Collection', '==', collection);
	}

	const totalLogs = await totalLogsQuery.get();

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

	return { ...(log.data() as LogEntry) };
};

// Export functions
export default { addLog, getAllLogs, getLog, getLogs };
