import service from '../services/form';
import type { Form, NewsletterSubscription } from '../types';
import { Request, Response } from 'express';
import Log from '../log';

// Submit Form
const submitForm = async (req: Request, res: Response) => {
	const form: Form = req.body;
	const result = await service.submitForm(form);

	// Log the form submission
	Log.addLog('Formulier Ingediend', 'Form ingediend door ' + form.Name, form);

	res.status(result.status).json(result.result);
};

// Get All Newsletter Subscriptions
const getNewsletterSubscriptions = async (req: Request, res: Response) => {
	const subscriptions = await service.getNewsletterSubscriptions(parseInt(req.query.page as string) || 0, parseInt(req.query.size as string) || 50);

	res.status(200).json(subscriptions);
};

// Get Newsletter Subscription
const getNewsletterSubscription = async (req: Request, res: Response) => {
	const { Email } = req.body;
	const subscription = await service.getNewsletterSubscription(Email);

	if (!subscription) {
		return res.status(404).json({ error: 'Subscription not found' });
	}

	res.status(200).json(subscription);
};

// Subscribe to Newsletter
const subscribeNewsletter = async (req: Request, res: Response) => {
	const email = req.body.email;
	const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	if (!email || !emailRegex.test(email)) {
		return res.status(400).json({ error: 'Invalid email address' });
	}

	// Check if the email is already subscribed
	const existingSubscription: NewsletterSubscription | null = await service.getNewsletterSubscription(email);
	if (existingSubscription) {
		return res.status(401).json({ error: 'Email is already subscribed' });
	}

	// Proceed with subscription
	// Create a new subscription object
	const subscription: NewsletterSubscription = {
		Email: email,
		CreatedAt: new Date().toISOString(),
		ID: '', // This will be set by the service
	};
	const result = await service.subscribeNewsletter(subscription);

	// Log the newsletter subscription
	Log.addLog('Newsletter Geabonneerd', 'Newsletter abonnement voor ' + email, subscription);

	res.status(result.status).json(result.result);
};

// Unsubscribe from Newsletter
const unsubscribeNewsletter = async (req: Request, res: Response) => {
	const email = req.body.Email;

	// Proceed with unsubscription
	await service.unsubscribeNewsletter(email);

	// Log the newsletter unsubscription
	Log.addLog('Newsletter Afgemeld', 'Newsletter afmelding voor ' + email, { email });

	res.status(200).json({ result: 'Unsubscribed successfully' });
};

export default { submitForm, getNewsletterSubscription, getNewsletterSubscriptions, subscribeNewsletter, unsubscribeNewsletter };
