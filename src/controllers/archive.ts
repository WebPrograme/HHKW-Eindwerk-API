import service from '../services/archive';
import type { ArchiveArticle } from '../types';
import { Request, Response } from 'express';
require('dotenv').config();

// Import the necessary environment variables
const ARCHIVE_MAX_REQUESTED_COUNT = process.env.ARCHIVE_MAX_REQUESTED_COUNT ? parseInt(process.env.ARCHIVE_MAX_REQUESTED_COUNT) : 100;

// Get All Articles
const getAllArticles = async (req: Request, res: Response) => {
	const page = req.query.page ? parseInt(req.query.page as string) : 1;
	const count = req.query.count ? parseInt(req.query.count as string) : ARCHIVE_MAX_REQUESTED_COUNT;
	const exceeded = count > ARCHIVE_MAX_REQUESTED_COUNT;
	const [articles, total, isLastPage] = await service.getAllArticles(page, exceeded ? ARCHIVE_MAX_REQUESTED_COUNT : count);

	// If the requested count exceeds the limit, let the client know how many articles are unavailable
	if (exceeded) {
		res.status(206)
			.send({ Articles: articles, Total: total, Exceeded: count - ARCHIVE_MAX_REQUESTED_COUNT })
			.end();
		return;
	}

	res.status(200).send({ Articles: articles, Total: total, IsLastPage: isLastPage }).end();
};

// Get Timeline Articles
const getTimelineArticles = async (req: Request, res: Response) => {
	const page = req.query.page ? parseInt(req.query.page as string) : 0;
	const count = req.query.count ? parseInt(req.query.count as string) : ARCHIVE_MAX_REQUESTED_COUNT;
	const exceeded = count > ARCHIVE_MAX_REQUESTED_COUNT;
	const [articles, total, isLastPage] = await service.getTimelineArticles(page, exceeded ? ARCHIVE_MAX_REQUESTED_COUNT : count);
	res.status(200).send({ Articles: articles, Total: total, IsLastPage: isLastPage }).end();
};

// Get Article by ID
const getArticle = async (req: Request, res: Response) => {
	const id = req.params.id.toLocaleLowerCase();
	const article = await service.getArticle(id);
	res.status(200).send(article).end();
};

// Add Article
const addArticle = async (req: Request, res: Response) => {
	const article = req.body.Article;
	const isLast = req.body.IsLast;
	const dateStr = new Date().toISOString().split('T')[0];
	article.CreatedAt = dateStr;

	// Generate ID
	while (true) {
		const id = Math.random().toString(36).substring(7);
		const exists = await service.getArticle(id);

		if (!exists) {
			article.ID = id;
			break;
		}
	}

	const splittedDescription = article.Description.trim()
		.split('\n')
		.map((line: string, index: number) => {
			const key = `${index}`;
			return { [key]: line };
		});

	article.Description = Object.assign({}, ...splittedDescription);

	// If it's not the last article, update the order of the following articles
	if (!isLast) {
		await service.updateOrder(article.Order);
	}

	await service.addArticle(article as ArchiveArticle);

	res.status(200).send({ ID: article.ID }).end();
};

// Update Article
const updateArticle = async (req: Request, res: Response) => {
	const article = req.body.Article;
	const oldOrder = parseInt(req.body.OldOrder);
	const isLast = parseInt(req.body.IsLast);
	const splittedDescription = article.Description.trim()
		.split('\n')
		.map((line: string, index: number) => {
			const key = `${index}`;
			return { [key]: line };
		});

	article.Description = Object.assign({}, ...splittedDescription);

	// If the order has changed, update the order
	if (article.Order !== oldOrder && !isLast) {
		await service.updateOrder(article.Order, oldOrder);
	}

	await service.updateArticle(article);

	res.status(200).send({ ID: article.ID }).end();
};

// Delete Article
const deleteArticles = async (req: Request, res: Response) => {
	const ids = req.body.IDs;

	await service.deleteArticles(ids);

	// Update the order of the following articles
	await service.resetOrder();

	res.status(200).send({ ID: ids }).end();
};

export default { getAllArticles, getTimelineArticles, getArticle, addArticle, updateArticle, deleteArticles };
