import type { LinkElement } from './linkElement';

export interface MenuSegment {
	categoryName: string;
	entries: LinkElement | LinkElement[];
}
