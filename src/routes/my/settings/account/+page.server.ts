import type { UpdateUser } from '$lib/server/updateUser';
import { isNotNullOrUndefined } from '$lib/util';
import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	updateEMail: async ({ request, locals }) => {
		const formData = await request.formData();
		const data: UpdateUser = Object.fromEntries(formData) as UpdateUser;
		console.warn(data);

		try {
			await locals.pb.collection('users').requestEmailChange(data.email);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			throw error(err.status, err.message);
		}

		return {
			success: true,
			data: {
				username: data.username,
				email: data.email
			}
		};
	},
	updateUsername: async ({ request, locals }) => {
		const formData = await request.formData();
		const data: UpdateUser = Object.fromEntries(formData) as UpdateUser;

		try {
			await locals.pb.collection('users').getFirstListItem(`username = "${data.username}"`);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			if (err.status === 404) {
				try {
					const { username } = await locals.pb
						.collection('users')
						.update(locals.user?.id, { username: data.username });
					if (isNotNullOrUndefined(locals.user)) {
						locals.user.username = username;

						return {
							success: true,
							data: {
								username: locals.user.username,
								email: data.email
							}
						};
					}

					throw error(400, 'Etwas ging bei der Aktualisierung des Benutzernamen schief');
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} catch (err: any) {
					console.error(err);

					throw error(err.status, err.message);
				}
			}
			console.error(err);
			throw error(err.status, err.message);
		}

		return {
			success: false,
			data: {
				username: data.username,
				email: data.email
			}
		};
	}
};
