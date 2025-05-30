// Function to clean up incoming data
export const cleanup = (data: string | string[]): typeof data => {
	if (Array.isArray(data)) {
		return data.map((item) => cleanup(item)) as string[]; // Cast the result as string[]
	}
	// Remove leading and trailing whitespaces
	const trimmed = data.trim();
	// Replace multiple whitespaces with a single whitespace
	const singleWhitespace = trimmed.replace(/\s\s+/g, ' ');
	// Only allow alphanumeric characters, spaces, and hyphens
	const cleaned = singleWhitespace.replace(/[^a-zA-Z0-9\s-]/g, '');

	return cleaned as string;
};
