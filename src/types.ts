type Output = {
	status: number;
	result: any;
};

type ArchiveArticle = {
	Title?: string;
	Description?: { [key: string]: string };
	Date?: {
		Day?: string;
		Month?: string;
		Year?: string;
	};
	CreatedAt: string;
	Image?: string;
	HasOwnPage: boolean;
	OnTimeline: boolean;
	VroonhofTag: boolean;
	ID: string;
	Order: number;
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
