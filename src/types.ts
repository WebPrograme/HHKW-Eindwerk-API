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

type Form = {
	Name: string;
	Email: string;
	Message: string;
};

type Section = {
	ID: string;
	Title: string;
	Content: string[];
	Timestamp: number;
	CreatedAt: string;
	Type: 'TextOnly' | 'TextWithImage';
	Image?: string;
	Order: number;
};

type HomeBlock = {
	Order: number;
	Title: string;
	Description: string;
	Image: string;
	Link: string;
};

type Publication = {
	ID: string;
	Title: string;
	CoverImage: string;
	ContentFile: string;
	CreatedAt: string;
};

export { Output, BlogArticle, BlogEvent, ArchiveArticle, HomeBlock, Form, Section, Publication };
