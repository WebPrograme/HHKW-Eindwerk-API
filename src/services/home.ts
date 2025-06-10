import { db } from '../config/firebase';
import type { HomeBlock } from '../types';

// Get All Blocks
const getAllBlocks = async () => {
	const blocks = await db.ref('Home/Blocks').get();
	const result = blocks.val();

	return result;
};

// Get Block by Order
const getBlock = async (order: string) => {
	const block = await db.ref(`Home/Blocks/${order}`).get();
	const result = block.val();

	return result;
};

// Update Block
const updateBlock = async (block: HomeBlock) => {
	await db.ref(`Home/Blocks/${block.Order}`).set(block);
};

export default {
	getAllBlocks,
	getBlock,
	updateBlock,
};
