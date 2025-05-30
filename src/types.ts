type Output = {
	status: number;
	result: any;
};

type BlogArticle = {
	Title: string;
	Description: string;
	CreatedAt: string;
	Image: string;
	ID: string;
	Timestamp: number;
};

type BlogEvent = {
	Title: string;
	Date: string;
	CreatedAt: string;
	Image: string;
	ID: string;
	Timestamp: number;
};

export { Output, BlogArticle, BlogEvent };
