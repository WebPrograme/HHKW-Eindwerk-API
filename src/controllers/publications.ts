import service from '../services/publications';
import type { Publication } from '../types';
import { Request, Response } from 'express';
import Log from '../log';

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

	// Log the addition of the publication
	await Log.addLog('Publicatie Toegevoegd', `Publicatie met ID ${publication.ID} is toegevoegd`, publication, req);

	res.status(201).send({ Publication: publication }).end();
};

// Update Publication
const updatePublication = async (req: Request, res: Response) => {
	const publication = req.body.Publication as Publication;
	await service.updatePublication(publication);

	// Log the update of the publication
	await Log.addLog('Publicatie Bijgewerkt', `Publicatie met ID ${publication.ID} is bijgewerkt`, publication, req);

	res.status(200).send({ Publication: publication }).end();
};

// Delete Publication
const deletePublication = async (req: Request, res: Response) => {
	const id = req.body.ID as string;
	await service.deletePublication(id);

	// Log the deletion of the publication
	await Log.addLog('Publicatie Verwijderd', `Publicatie met ID ${id} is verwijderd`, { ID: id }, req);

	res.status(200).send({ Deleted: id }).end();
};

export default {
	getAllPublications,
	addPublication,
	updatePublication,
	deletePublication,
};
