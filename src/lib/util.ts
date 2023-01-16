import { browser } from '$app/environment';
import { PUBLIC_PB_BASE_URL } from '$env/static/public';
import type { DataObject } from './types/dataRow';

export function isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
	return typeof obj === 'undefined' || obj === null;
}

export function isNotNullOrUndefined<T>(obj: T | null | undefined): obj is T {
	return !isNullOrUndefined<T>(obj);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeNonPOJOs<T>(obj: any) {
	return structuredClone<T>(obj);
}

export function getImageURL(
	collectionId: string,
	recordId: string,
	fileName: string,
	size: string
): string {
	return `${PUBLIC_PB_BASE_URL}/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
}

export function startCsvDownload(data: DataObject[], headers: string[], fileName: string) {
	const columnDelimiter = ';';
	const lineDelimiter = '\n';

	let result = '';
	result += headers.map((header) => toTitleCase(header)).join(columnDelimiter);
	result += lineDelimiter;

	data.forEach((row) => {
		result += headers.map((header) => row[header]).join(columnDelimiter);
		result += lineDelimiter;
	});

	const blob = new Blob([result]);
	if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
		const hiddenElement = window.document.createElement('a');
		hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(result);
		hiddenElement.target = '_blank';
		hiddenElement.download = fileName;
		hiddenElement.click();
	} else {
		const link = document.createElement('a');
		if (link.download !== undefined) {
			// Browsers that support HTML5 download attribute
			const url = URL.createObjectURL(blob);
			link.setAttribute('href', url);
			link.setAttribute('download', fileName);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}

	return;
}

export function toTitleCase(str: string): string | undefined {
	return str
		.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
		?.map((x) => x.charAt(0).toUpperCase() + x.slice(1))
		.join(' ');
}

export function sqlTimeNow(): string {
	const time = new Date().toISOString().replace('T', ' ');

	return time;
}

export function sessionStore(field: string, value: string) {
	if (browser) window.sessionStorage.setItem(field, value);
}
