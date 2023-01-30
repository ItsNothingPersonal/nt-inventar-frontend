import { getProjektByUserId } from '$lib/server/pocketbase';
import type { Projekt } from '$lib/types/projekt';
import { isNotNullOrUndefined } from '$lib/util';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({
	locals
}): Promise<{
	projekt: Projekt | undefined;
}> => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const projekt = await getProjektByUserId(locals.pb, locals.user?.projekt);

	return {
		projekt: isNotNullOrUndefined(projekt) ? JSON.parse(JSON.stringify(projekt)) : undefined
	};
}) satisfies PageServerLoad;

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
