import service from '../services/form';
import type { Form } from '../types';
import { Request, Response } from 'express';

//Submit Form
const submitForm = async (req: Request, res: Response) => {
	const form: Form = req.body;
	const result = await service.submitForm(form);

	res.status(result.status).json(result.result);
};

export default { submitForm };
