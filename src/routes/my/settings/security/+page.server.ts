import type { UpdatePassword } from '$lib/server/updatePassword';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	updatePassword: async ({ request, locals }) => {
		const formData = await request.formData();
		const data: UpdatePassword = Object.fromEntries(formData) as UpdatePassword;

		try {
			await locals.pb.collection('users').update(locals.user?.id, data);
			locals.pb.authStore.clear();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.error(err);
			throw error(err.status, err.message);
		}

		throw redirect(303, '/login');
	}
};
