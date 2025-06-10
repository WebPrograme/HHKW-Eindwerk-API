import postmark from '../config/postmark';
import type { Form } from '../types';

// Submit Form
const submitForm = async (form: Form) => {
	postmark.client.sendEmail({
		From: 'Yarne Gooris <els@hoevelootens.be>',
		To: 'yarne.gooris@gmail.com',
		Subject: 'New Form Submission',
		TextBody: 'Name: ' + form.Name + '\nEmail: ' + form.Email + '\nMessage: ' + form.Message,
		MessageStream: 'outbound',
	});

	return { status: 200, result: 'Form submitted' };
};

export default { submitForm };
