import service from '../services/publications';
import type { Publication } from '../types';
import { Request, Response } from 'express';

// Get All Publications
const getAllPublications = async (req: Request, res: Response) => {
	const publications = await service.getAllPublications();
	res.status(200).send({ Publications: publications }).end();
};

// Add Publication
const addPublication = async (req: Request, res: Response) => {
	const publication = req.body.Publication as Publication;
	const dateStr = new Date().toISOString().split('T')[0];
	publication.CreatedAt = dateStr;

	// Generate ID
	while (true) {
		const id = Math.random().toString(36).substring(7);
		const exists = await service.getPublication(id);

		if (!exists) {
			publication.ID = id;
			break;
		}
	}

	await service.addPublication(publication);
	res.status(201).send({ Publication: publication }).end();
};

// Update Publication
const updatePublication = async (req: Request, res: Response) => {
	const publication = req.body.Publication as Publication;
	await service.updatePublication(publication);
	res.status(200).send({ Publication: publication }).end();
};

// Delete Publication
const deletePublication = async (req: Request, res: Response) => {
	const id = req.body.ID as string;
	await service.deletePublication(id);
	res.status(200).send({ Deleted: id }).end();
};

export default {
	getAllPublications,
	addPublication,
	updatePublication,
	deletePublication,
};
