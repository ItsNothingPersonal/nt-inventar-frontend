import type { FormUserLogin } from '$lib/server/formUserLogin';
import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const formData = await request.formData();
		const data: FormUserLogin = Object.fromEntries(formData) as FormUserLogin;

		try {
			await locals.pb.collection('users').authWithPassword(data.email, data.password);
			if (!locals.pb.authStore.model.verified) {
				locals.pb.authStore.clear();
				return {
					notVerified: true
				};
			}
		} catch (err) {
			console.error(error);
			throw error(500, `Etwas ist beim Login schief gegangen`);
		}

		throw redirect(303, '/');
	}
};
