import service from '../services/contact';
import { cleanup } from '../helper';
import type { Section } from '../types';
import { Request, Response } from 'express';
import Log from '../log';

// Get All Sections
const getAllSections = async (req: Request, res: Response) => {
	const persons = await service.getAllSections();
	res.status(200).send(persons).end();
};

// Add Section
const addSection = async (req: Request, res: Response) => {
	let section = req.body.Section;
	const isLast = req.body.IsLast;
	section.Timestamp = Date.now();
	section.CreatedAt = new Date().toISOString().split('T')[0];

	// Generate ID
	while (true) {
		const id = Math.random().toString(36).substring(7);
		const exists = await service.getSection(id);

		if (!exists) {
			section.ID = id;
			break;
		}
	}

	// Split Content
	const splittedDescription = section.Content.trim()
		.split('\n')
		.map((line: string, index: number) => {
			const key = `${index}`;
			line = cleanup(line) as string;
			return { [key]: line };
		});

	section.Content = Object.assign({}, ...splittedDescription);

	// If it's not the last section, update the order of the following sections
	if (!isLast) {
		await service.updateOrder(parseInt(section.Order));
	}

	await service.addSection(section as Section);

	// Log the addition of the section
	await Log.addLog('Sectie Toegevoegd', `Sectie met ID ${section.ID} is toegevoegd`, section, req);

	res.status(200).send(section).end();
};

// Update Section
const updateSection = async (req: Request, res: Response) => {
	let section = req.body.Section;
	const oldOrder = parseInt(req.body.OldOrder);
	const isLast = parseInt(req.body.IsLast);
	section.Timestamp = Date.now();

	// Split Content
	const splittedDescription = section.Content.trim()
		.split('\n')
		.map((line: string, index: number) => {
			const key = `${index}`;
			line = cleanup(line) as string;
			return { [key]: line };
		});

	section.Content = Object.assign({}, ...splittedDescription);

	// If the order has changed, update the order
	if (section.Order !== oldOrder && !isLast) {
		await service.updateOrder(section.Order, oldOrder);
	}

	await service.updateSection(section.ID, section as Section);

	// Log the update of the section
	await Log.addLog('Sectie Bijgewerkt', `Sectie met ID ${section.ID} is bijgewerkt`, section, req);

	res.status(200).send(section).end();
};

// Delete Section
const deleteSection = async (req: Request, res: Response) => {
	await service.deleteSection(req.body.ID);

	// Update the order of the following articles
	await service.resetOrder();

	// Log the deletion of the section
	await Log.addLog('Sectie Verwijderd', `Sectie met ID ${req.body.ID} is verwijderd`, req.body, req);

	res.status(200).send({ Name: req.body.ID }).end();
};

export default { getAllSections, addSection, updateSection, deleteSection };
