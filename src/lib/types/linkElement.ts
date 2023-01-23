export interface LinkElement {
	label: string;
	href?: string;
	hidden?: boolean;
	type?: 'Link' | 'Button' | 'Input';
	onClick?: () => void;
	cssClass?: string;
}
