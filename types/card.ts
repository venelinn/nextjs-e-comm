interface CardImage {
	src: string;
	width: number;
	height: number;
	alt?: string;
}

export interface CardProps {
	heading: {
		title: string;
		size: string; // or perhaps a more specific type like 'h1' | 'h2' | 'h3'
	};
	image?: string;
	content?: string;
	link?: {
		url: string;
		type: string; // or perhaps a more specific type
	};
}
