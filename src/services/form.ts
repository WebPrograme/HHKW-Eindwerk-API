import { db } from '../config/firebase';
import postmark from '../config/postmark';
import type { Form, NewsletterSubscription } from '../types';

// Submit Form
const submitForm = async (form: Form) => {
	postmark.client.sendEmail({
		From: 'Yarne Gooris <els@hoevelootens.be>',
		To: 'yarne.gooris@gmail.com',
		Subject: 'Nieuw formulier ingediend',
		TextBody: 'Naam: ' + form.Name + '\nEmail: ' + form.Email + '\nBericht: ' + form.Message,
		MessageStream: 'outbound',
	});

	return { status: 200, result: 'Formulier ingediend' };
};

// Get All Newsletter Subscriptions
const getNewsletterSubscriptions = async (page: number = 0, size: number = 50): Promise<{ subscriptions: NewsletterSubscription[]; total: number }> => {
	const snapshot = await db
		.ref('Newsletter/Subscriptions')
		.orderByChild('CreatedAt')
		.limitToFirst(size)
		.startAt(page * size)
		.get();
	const subscriptions = snapshot.val();

	if (!subscriptions) {
		return {
			subscriptions: [],
			total: 0,
		};
	}

	// Total number of subscriptions
	const totalSubscriptionsSnapshot = await db.ref('Newsletter/Subscriptions').get();
	const totalSubscriptions = totalSubscriptionsSnapshot.numChildren();

	return {
		subscriptions: Object.values(subscriptions) as NewsletterSubscription[],
		total: totalSubscriptions,
	};
};

// Get Newsletter Subscription
const getNewsletterSubscription = async (email: string) => {
	const snapshot = await db.ref('Newsletter/Subscriptions').orderByChild('Email').equalTo(email).get();
	const subscriptions = snapshot.val();

	if (!subscriptions || Object.keys(subscriptions).length === 0) {
		return null;
	}

	const subscription = Object.values(subscriptions)[0] as NewsletterSubscription;
	return subscription;
};

// Subscribe to Newsletter
const subscribeNewsletter = async (subscription: { Email: string; CreatedAt: string; ID: string }) => {
	// Add the subscription to the database
	const docRef = db.ref('Newsletter/Subscriptions').push();
	subscription.ID = docRef.key || '';
	docRef.set(subscription);

	// Send confirmation email
	postmark.client.sendEmail({
		From: 'Yarne Gooris <els@hoevelootens.be>',
		To: subscription.Email,
		Subject: 'Nieuwsbrief abonnement',
		TextBody: 'Bedankt voor uw abonnement op de nieuwsbrief!',
		MessageStream: 'outbound',
	});

	return { status: 200, result: 'Abonnement bevestigd' };
};

// Unsubscribe from Newsletter
const unsubscribeNewsletter = async (email: string) => {
	const snapshot = await db.ref('Newsletter/Subscriptions').orderByChild('Email').equalTo(email).get();
	const subscriptions = snapshot.val();

	if (!subscriptions || Object.keys(subscriptions).length === 0) {
		return { status: 404, result: 'Abonnement niet gevonden' };
	}

	const subscriptionId = Object.keys(subscriptions)[0];
	await db.ref(`Newsletter/Subscriptions/${subscriptionId}`).remove();

	return { status: 200, result: 'Abonnement geannuleerd' };
};

export default { submitForm, subscribeNewsletter, getNewsletterSubscription, getNewsletterSubscriptions, unsubscribeNewsletter };
