import { db } from '../config/firebase';
import type { ArchiveArticle } from '../types';

// Get All Articles
const getAllArticles = async (page?: number, count?: number) => {
	if (page >= 0 && count >= 0) {
		const articles = await db.ref('Archive/Articles').get();
		const result = articles.val();

		// If there are no articles, return an empty object
		if (!result) {
			return [{}, 0];
		}

		// Sort articles by order
		const sortedArticles = Object.values(result).sort((a: ArchiveArticle, b: ArchiveArticle) => a.Order - b.Order);

		// Get the start and end index
		const start = page * count;
		const end = start + count;

		// Slice the articles
		const slicedArticles = Object.values(sortedArticles).slice(start, end);

		// Convert the array to an object
		const resultObj = Object.assign({}, ...slicedArticles.map((article: ArchiveArticle) => ({ [article.ID]: article })));

		// Check if its the last page
		const isLastPage = end >= Object.keys(result).length;

		return [resultObj, Object.keys(result).length, isLastPage];
	} else {
		const articles = await db.ref('Archive/Articles').get();
		const result = articles.val();

		return [result, Object.keys(result).length, true];
	}
};

// Get Timeline Articles
const getTimelineArticles = async (page?: number, count?: number) => {
	const articles = await db.ref('Archive/Articles').get();
	const result = articles.val();

	// If there are no articles, return an empty object
	if (!result) {
		return [{}, 0];
	}

	// Filter out the non-timeline articles
	Object.keys(result).forEach((key) => {
		if (!result[key].OnTimeline) {
			delete result[key];
		}
	});

	// If there are no timeline articles, return an empty object
	if (Object.keys(result).length === 0) {
		return [{}, 0];
	}

	// Sort articles by order
	const sortedArticles = Object.values(result).sort((a: ArchiveArticle, b: ArchiveArticle) => b.Order - a.Order);

	// Get the start and end index
	const start = page * count;
	const end = start + count;

	// Slice the articles
	const slicedArticles = Object.values(sortedArticles).slice(start, end);

	// Convert the array to an object
	const resultObj = Object.assign({}, ...slicedArticles.map((article: ArchiveArticle) => ({ [article.ID]: article })));

	// Check if its the last page
	const isLastPage = end >= Object.keys(result).length;

	return [resultObj, Object.keys(result).length, isLastPage];
};

// Get Article by ID
const getArticle = async (id: string) => {
	const article = await db.ref(`Archive/Articles/${id}`).get();
	const result = article.val();

	return result;
};

// Add Article
const addArticle = async (article: ArchiveArticle) => {
	await db.ref('Archive/Articles/' + article.ID).set(article);
};

// Update Article
const updateArticle = async (article: ArchiveArticle) => {
	await db.ref(`Archive/Articles/${article.ID}`).set(article);
};

// Delete Articles
const deleteArticles = async (ids: string[]) => {
	const promises = ids.map(async (id) => {
		await db.ref(`Archive/Articles/${id}`).remove();
	});

	await Promise.all(promises);
};

// Update Order
const updateOrder = async (order: number, oldOrder?: number) => {
	const [articles, total, isLastPage] = await getAllArticles();

	const promises = Object.keys(articles).map(async (key) => {
		const article = articles[key];

		if (oldOrder !== undefined) {
			if (article.Order === oldOrder) {
				article.Order = order;
			} else if (article.Order > oldOrder && article.Order <= order) {
				article.Order -= 1;
			} else if (article.Order < oldOrder && article.Order >= order) {
				article.Order += 1;
			}
		} else {
			if (article.Order >= order) {
				article.Order += 1;
			}
		}

		await db.ref(`Archive/Articles/${article.ID}/Order`).set(article.Order);
	});

	await Promise.all(promises);
};

// Reset Order
const resetOrder = async () => {
	const [articles, total, isLastPage] = await getAllArticles();

	// Sort articles by order
	const sortedArticles = Object.values(articles).sort((a: ArchiveArticle, b: ArchiveArticle) => a.Order - b.Order);

	// Loop through the articles and find holes in the order
	const promises = sortedArticles.map(async (article: ArchiveArticle, index) => {
		if (article.Order !== index + 1) {
			await db.ref(`Archive/Articles/${article.ID}/Order`).set(index + 1);
		}
	});
};

export default { getAllArticles, getTimelineArticles, getArticle, addArticle, updateArticle, updateOrder, deleteArticles, resetOrder };
