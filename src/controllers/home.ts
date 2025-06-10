import service from '../services/home';
import type { HomeBlock } from '../types';
import { Request, Response } from 'express';

// Get All Blocks
const getAllBlocks = async (req: Request, res: Response) => {
	const blocks = await service.getAllBlocks();
	res.status(200).send(blocks).end();
};

// Get Block by order
const getBlock = async (req: Request, res: Response) => {
	const order = req.params.order;
	const block = await service.getBlock(order);
	res.status(200).send(block).end();
};

// Update Block
const updateBlock = async (req: Request, res: Response) => {
	const block = req.body.Block as HomeBlock;
	await service.updateBlock(block);
	res.status(200).send(block).end();
};

export default {
	getAllBlocks,
	getBlock,
	updateBlock,
};
