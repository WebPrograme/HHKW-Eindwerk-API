import service from '../services/blog';
import { cleanup } from '../helper';
import type { BlogArticle, BlogEvent } from '../types';
import { Request, Response } from 'express';
import Log from '../log';
require('dotenv').config();

// Get All Articles
const getAllArticles = async (req: Request, res: Response) => {
	const page = req.query.page ? parseInt(req.query.page as string) : 0;
	const count = req.query.count ? parseInt(req.query.count as string) : 0;
	const [articles, total] = await service.getAllArticles(page, count);
	res.status(200).send({ Articles: articles, Total: total }).end();
};

// Get Article by ID
const getArticle = async (req: Request, res: Response) => {
	const id = req.params.id.toLocaleLowerCase();
	const article = await service.getArticle(id);

	if (!article) {
		res.status(404).send({ Error: 'Article not found' }).end();
		return;
	}
	res.status(200).send(article).end();
};

// Add Article
const addArticle = async (req: Request, res: Response) => {
	const article = req.body.Article;
	const dateStr = new Date().toISOString().split('T')[0];
	article.CreatedAt = dateStr;
	const timestamp = new Date().getTime();
	article.Timestamp = timestamp;

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
			line = cleanup(line) as string;
			return { [key]: line };
		});

	article.Description = Object.assign({}, ...splittedDescription);

	await service.addArticle(article as BlogArticle);

	// Log the addition of the article
	await Log.addLog('Blog Artikel Toegevoegd', `Artikel met ID ${article.ID} is toegevoegd`, { article }, req);

	res.status(200).send(article).end();
};

// Update Article
const updateArticle = async (req: Request, res: Response) => {
	const article = req.body.Article;
	const splittedDescription = article.Description.trim()
		.split('\n')
		.map((line: string, index: number) => {
			const key = `${index}`;
			line = cleanup(line) as string;
			return { [key]: line };
		});

	article.Description = Object.assign({}, ...splittedDescription);
	await service.updateArticle(article as BlogArticle);

	// Log the update of the article
	await Log.addLog('Blog Artikel Bijgewerkt', `Artikel met ID ${article.ID} is bijgewerkt`, { article }, req);

	res.status(200).send(article).end();
};

// Delete Articles
const deleteArticles = async (req: Request, res: Response) => {
	const ids: string[] = req.body.IDs;
	await service.deleteArticles(ids);

	// Log the deletion of the articles
	await Log.addLog('Blog Artikelen Verwijderd', `Artikelen met IDs ${ids.join(', ')} zijn verwijderd`, { IDs: ids }, req);

	res.status(200).send({ IDs: ids }).end();
};

// Search Articles
const searchArticles = async (req: Request, res: Response) => {
	const query = req.params.q;
	const queryStr = query.toLowerCase().replace(/-/g, ' ').trim();
	const articles = await service.searchArticles(queryStr);

	res.status(200).send(articles).end();
};

// Get All Events
const getAllEvents = async (req: Request, res: Response) => {
	const page = req.query.page ? parseInt(req.query.page as string) : 0;
	const count = req.query.count ? parseInt(req.query.count as string) : 0;
	const hidePast = req.query.hidePast ? req.query.hidePast === 'true' : false;
	const [events, total] = await service.getAllEvents(page, count, hidePast);
	res.status(200).send({ Events: events, Total: total }).end();
};

// Get Event by ID
const getEvent = async (req: Request, res: Response) => {
	const id = req.params.id.toLocaleLowerCase();
	const event = await service.getEvent(id);

	if (!event) {
		res.status(404).send({ Error: 'Event not found' }).end();
		return;
	}
	res.status(200).send(event).end();
};

// Add Event
const addEvent = async (req: Request, res: Response) => {
	const event = req.body.Event;
	const dateStr = new Date().toISOString().split('T')[0];
	event.CreatedAt = dateStr;
	const timestamp = new Date().getTime();
	event.Timestamp = timestamp;

	// Generate ID
	while (true) {
		const id = Math.random().toString(36).substring(7);
		const exists = await service.getEvent(id);

		if (!exists) {
			event.ID = id;
			break;
		}
	}

	await service.addEvent(event);

	// Log the addition of the event
	await Log.addLog('Blog Event Toegevoegd', `Event met ID ${event.ID} is toegevoegd`, event, req);

	res.status(200).send(event).end();
};

// Update Event
const updateEvent = async (req: Request, res: Response) => {
	const event = req.body.Event;
	await service.updateEvent(event);

	// Log the update of the event
	await Log.addLog('Blog Event Bijgewerkt', `Event met ID ${event.ID} is bijgewerkt`, event, req);

	res.status(200).send(event).end();
};

// Delete Events
const deleteEvents = async (req: Request, res: Response) => {
	const ids: string[] = req.body.IDs;
	await service.deleteEvents(ids);

	// Log the deletion of the events
	await Log.addLog('Blog Events Verwijderd', `Events met IDs ${ids.join(', ')} zijn verwijderd`, { IDs: ids }, req);

	res.status(200).send({ IDs: ids }).end();
};

export default { getAllArticles, getArticle, addArticle, updateArticle, deleteArticles, searchArticles, getAllEvents, getEvent, addEvent, updateEvent, deleteEvents };
