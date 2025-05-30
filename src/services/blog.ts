import { db } from '../config/firebase';
import type { BlogArticle, BlogEvent } from '../types';

// Get All Articles
const getAllArticles = async (page?: number, count?: number) => {
	if (page >= 0 && count >= 1) {
		const articles = await db.ref('Blog/Articles').get();
		const result = articles.val();

		// If there are no articles, return an empty object
		if (!result) {
			return [{}, 0];
		}

		// Sort articles by newest first
		const sortedArticles = Object.values(result).sort((a: BlogArticle, b: BlogArticle) => b.Timestamp - a.Timestamp);

		// Get the start and end index
		const start = page * count;
		const end = start + count;

		// Slice the articles
		const slicedArticles = Object.values(sortedArticles).slice(start, end);

		// Convert the array to an object
		const resultObj = Object.assign({}, ...slicedArticles.map((article: BlogArticle) => ({ [article.ID]: article })));

		return [resultObj, Object.keys(result).length];
	} else {
		const articles = await db.ref('Blog/Articles').get();
		const result = articles.val();

		return [result, Object.keys(result).length];
	}
};

// Get Article by ID
const getArticle = async (id: string) => {
	const article = await db.ref(`Blog/Articles/${id}`).get();
	const result = article.val();

	return result;
};

// Add Article
const addArticle = async (article: BlogArticle) => {
	await db.ref('Blog/Articles/' + article.ID).set(article);
};

// Update Article
const updateArticle = async (article: BlogArticle) => {
	await db.ref(`Blog/Articles/${article.ID}`).set(article);
};

// Delete Articles
const deleteArticles = async (ids: string[]) => {
	const promises = ids.map(async (id) => {
		await db.ref(`Blog/Articles/${id}`).remove();
	});

	await Promise.all(promises);
};

// Search Articles
const searchArticles = async (query: string) => {
	const articles = await db.ref('Blog/Articles').get();
	const result = articles.val();
	if (!result) {
		return [];
	}

	const filteredArticles = Object.values(result).filter((article: BlogArticle) => {
		const title = article.Title.toLowerCase();
		const description = Object.values(article.Description).join(' ').toLowerCase();

		return title.includes(query) || description.includes(query);
	});

	return filteredArticles;
};

// Get All Events
const getAllEvents = async (page?: number, count?: number, hidePast?: boolean) => {
	const now = new Date().getTime();

	if (page >= 0 && count >= 1) {
		const events = await db.ref('Blog/Events').get();
		const result = events.val();

		// If there are no events, return an empty object
		if (!result) {
			return [{}, 0];
		}

		// Sort events by newest first, not by timestamp but by earliest upcoming event
		let sortedEvents = Object.values(result).sort((a: BlogEvent, b: BlogEvent) => new Date(a.Date).getTime() - new Date(b.Date).getTime());

		// Filter out past events
		if (hidePast) {
			sortedEvents = sortedEvents.filter((event: BlogEvent) => new Date(event.Date).getTime() >= now);
		}

		// Get the start and end index
		const start = page * count;
		const end = start + count;

		// Slice the events
		const slicedEvents = Object.values(sortedEvents).slice(start, end);

		// Convert the array to an object
		const resultObj = Object.assign({}, ...slicedEvents.map((event: BlogEvent) => ({ [event.ID]: event })));

		return [resultObj, Object.keys(result).length];
	} else {
		const events = await db.ref('Blog/Events').get();
		let result = events.val();

		// If there are no events, return an empty object
		if (!result) {
			return [{}, 0];
		}

		// Sort events by newest first, not by timestamp but by earliest upcoming event
		let sortedEvents = Object.values(result).sort((a: BlogEvent, b: BlogEvent) => new Date(a.Date).getTime() - new Date(b.Date).getTime());

		// Filter out past events
		if (hidePast) {
			sortedEvents = sortedEvents.filter((event: BlogEvent) => new Date(event.Date).getTime() >= now);
		}

		// Convert the array to an object
		result = Object.assign({}, ...sortedEvents.map((event: BlogEvent) => ({ [event.ID]: event })));

		return [result, Object.keys(result).length];
	}
};

// Get Event by ID
const getEvent = async (id: string) => {
	const event = await db.ref(`Blog/Events/${id}`).get();
	const result = event.val();

	return result;
};

// Add Event
const addEvent = async (event: BlogEvent) => {
	await db.ref('Blog/Events/' + event.ID).set(event);
};

// Update Event
const updateEvent = async (event: BlogEvent) => {
	await db.ref(`Blog/Events/${event.ID}`).set(event);
};

// Delete Events
const deleteEvents = async (ids: string[]) => {
	const promises = ids.map(async (id) => {
		await db.ref(`Blog/Events/${id}`).remove();
	});

	await Promise.all(promises);
};

export default { getAllArticles, getArticle, addArticle, updateArticle, deleteArticles, searchArticles, getAllEvents, getEvent, addEvent, updateEvent, deleteEvents };
