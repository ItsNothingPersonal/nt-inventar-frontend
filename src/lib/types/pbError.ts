export interface PbError {
	status: number;
	data: { code: number; message: string; data: unknown };
}
