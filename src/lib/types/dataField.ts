import type { NestedKeyOf } from './nestedKeyOf';

export interface DBField<T> {
	value: NestedKeyOf<T>;
	id?: string;
	isExpanded?: boolean;
	fieldName?: string;
	isImage?: boolean;
	detailsLink?: boolean | string;
	sortKey?: NestedKeyOf<T>;
}
