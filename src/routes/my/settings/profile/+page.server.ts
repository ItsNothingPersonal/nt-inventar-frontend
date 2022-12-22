import { isNotNullOrUndefined } from '$lib/util';
import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		const formData = await request.formData();
		const userAvatar: File = formData.get('avatar') as File;

		if (isNotNullOrUndefined(userAvatar) && userAvatar.size === 0) {
			formData.delete('avatar');
		}
		try {
			const { name, avatar } = await locals.pb
				.collection('users')
				.update(locals?.user?.id, formData);
			if (isNotNullOrUndefined(locals.user)) {
				locals.user.name = name;
				locals.user.avatar = avatar;
			}
		} catch (err) {
			console.error(err);
			throw error(400, 'Etwas ist beim Updaten des Profils schief gegangen');
		}

		return {
			success: true
		};
	}
};
