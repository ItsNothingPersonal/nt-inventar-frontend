import type { PBUser } from '$lib/types/user';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }): Promise<{ user: PBUser | undefined }> => {
	if (locals.user) {
		return {
			user: locals.user
		};
	}
	return { user: undefined };
}) satisfies LayoutServerLoad;
