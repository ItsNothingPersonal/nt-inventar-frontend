import { isNotNullOrUndefined } from '$lib/util';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (isNotNullOrUndefined(locals.user)) {
		throw redirect(303, '/gegenstand');
	}
	return {};
}) satisfies PageServerLoad;
