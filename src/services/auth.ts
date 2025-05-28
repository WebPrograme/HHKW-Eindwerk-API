import { auth } from '../config/firebase';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import type { Output } from '../types';

// Validate Token
const validateToken = async (token: string): Promise<Output> => {
	const result = await signInWithCredential(auth, GoogleAuthProvider.credential(token));

	if (result.user.email === 'yarne.gooris@gmail.com') return { status: 200, result: result.user };
	return { status: 401, result: 'Unauthorized' };
};

export default { validateToken };
