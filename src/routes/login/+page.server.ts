import type { FormUserLogin } from '$lib/server/formUserLogin';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const authMethods = await locals.pb.collection('users').listAuthMethods();
	return {
		authProviders: authMethods.authProviders.sort((a: { name: string }, b: { name: string }) =>
			a.name.localeCompare(b.name)
		)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const formData = await request.formData();
		const data: FormUserLogin = Object.fromEntries(formData) as FormUserLogin;

		try {
			await locals.pb.collection('users').authWithPassword(data.email, data.password);
			if (!locals.pb.authStore.model.verified) {
				locals.pb.authStore.clear();
				return {
					success: false,
					notVerified: true
				};
			}
		} catch (err) {
			return {
				success: false,
				notVerified: false
			};
		}

		throw redirect(303, '/');
	},
	resetPassword: async ({ request, locals }) => {
		const formData = await request.formData();

		try {
			await locals.pb.collection('users').requestPasswordReset(formData.get('email'));
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			throw error(err.status, err.message);
		}

		return {
			success: true,
			notVerified: false
		};
	}
};
