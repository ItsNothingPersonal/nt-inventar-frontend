import type { PBUser } from '$lib/types/user';
import type PocketBase from 'pocketbase';
import type { LayoutServerLoad } from './$types';

export const load = (async ({
	locals
}): Promise<{ user: PBUser | undefined; pb: PocketBase | undefined }> => {
	if (locals.user) {
		return {
			user: locals.user,
			pb: locals.pb
		};
	}
	return { user: undefined, pb: undefined };
}) satisfies LayoutServerLoad;
