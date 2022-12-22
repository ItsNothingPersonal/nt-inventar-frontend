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
	size = '0x0'
): string {
	return `http://localhost:8090/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
}
