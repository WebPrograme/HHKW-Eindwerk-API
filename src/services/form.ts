import postmark from '../config/postmark';
import type { Form } from '../types';

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

export default { submitForm };
