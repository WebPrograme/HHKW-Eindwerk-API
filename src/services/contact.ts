import { db } from '../config/firebase';
import type { Section } from '../types';

// Get All Sections
const getAllSections = async () => {
	const snapshot = await db.ref('Contact/Sections').get();
	const sections = snapshot.val();

	// Sort sections by order
	const sortedSections = Object.values(sections).sort((a: Section, b: Section) => a.Order - b.Order);

	return sortedSections || [];
};

// Get Section by ID
const getSection = async (id: string) => {
	const snapshot = await db.ref('Contact/Sections/' + id).get();
	const section = snapshot.val();

	return section;
};

// Add Section
const addSection = async (section: Section) => {
	await db.ref(`Contact/Sections/${section.ID}`).set(section);
};

// Update Section
const updateSection = async (id: string, section: Section) => {
	await db.ref(`Contact/Sections/${id}`).set(section);
};

// Delete Section
const deleteSection = async (id: string) => {
	await db.ref(`Contact/Sections/${id}`).remove();
};

// Update Order
const updateOrder = async (order: number, oldOrder?: number) => {
	const sections = (await getAllSections()) as unknown as { [key: string]: Section };
	console.log(order, oldOrder);

	const promises = Object.keys(sections).map(async (key) => {
		const section = sections[key];

		if (oldOrder !== undefined) {
			if (section.Order === oldOrder) {
				section.Order = order;
			} else if (section.Order > oldOrder && section.Order <= order) {
				section.Order -= 1;
			} else if (section.Order < oldOrder && section.Order >= order) {
				section.Order += 1;
			}
		} else {
			if (section.Order >= order) {
				section.Order += 1;
			}
		}

		await db.ref(`Contact/Sections/${section.ID}/Order`).set(section.Order);
	});

	await Promise.all(promises);
};

// Reset Order
const resetOrder = async () => {
	const sections = await getAllSections();

	// Sort sections by order
	const sortedSections = Object.values(sections).sort((a: Section, b: Section) => a.Order - b.Order);

	// Loop through the articles and find holes in the order
	const promises = sortedSections.map(async (section: Section, index) => {
		if (section.Order !== index + 1) {
			await db.ref(`Contact/Sections/${section.ID}/Order`).set(index + 1);
		}
	});
};

export default { getAllSections, getSection, addSection, updateSection, deleteSection, updateOrder, resetOrder };
