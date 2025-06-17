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

type NewsletterSubscription = {
	Email: string;
	CreatedAt: string;
	ID: string;
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

type Publication = {
	ID: string;
	Title: string;
	CoverImage: string;
	ContentFile: string;
	CreatedAt: string;
};

type LogCollection = 'BlogArticles' | 'BlogEvents' | 'ArchiveArticles' | 'Sections' | 'Publications' | 'Forms' | 'NewsletterSubscriptions';

type LogEntry = {
	CreatedAt: FirebaseFirestore.Timestamp;
	ExpiryDate: FirebaseFirestore.Timestamp;
	Collection: LogCollection;
	Action: string;
	Description: string;
	DeepInfo?: Record<string, any>;
};

export { Output, BlogArticle, BlogEvent, ArchiveArticle, Form, NewsletterSubscription, Section, Publication, LogEntry, LogCollection };
