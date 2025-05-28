import { ServerClient } from 'postmark';
require('dotenv').config();

const token = process.env.POSTMARK_API_TOKEN;
const client = new ServerClient(token);

// Export client
export default { client, token };
