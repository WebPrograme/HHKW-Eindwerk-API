import { db } from '../config/firebase';
import type { Publication } from '../types';

// Get All Publications
const getAllPublications = async (): Promise<Publication[]> => {
	const publications = await db.ref('Publications').get();
	const result = publications.val();

	return result;
};

// Get Publication by ID
const getPublication = async (id: string): Promise<Publication | null> => {
	const publication = await db.ref(`Publications/${id}`).get();
	const result = publication.val();

	return result;
};

// Add Publication
const addPublication = async (publication: Publication) => {
	await db.ref(`Publications/${publication.ID}`).set(publication);
};

// Update Publication
const updatePublication = async (publication: Publication) => {
	await db.ref(`Publications/${publication.ID}`).set(publication);
};

// Delete Publication
const deletePublication = async (id: string) => {
	await db.ref(`Publications/${id}`).remove();
};

export default {
	getAllPublications,
	getPublication,
	addPublication,
	updatePublication,
	deletePublication,
};
