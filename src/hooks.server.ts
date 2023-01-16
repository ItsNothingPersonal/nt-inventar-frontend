import { COOKIE_NAME, IS_PRODUCTION } from '$env/static/private';
import { PUBLIC_PB_BASE_URL } from '$env/static/public';
import { serializeNonPOJOs } from '$lib/util';
import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

export const handle = (async ({ event, resolve }) => {
	const cookie = event.request.headers.get('cookie');
	event.locals.pb = new PocketBase(PUBLIC_PB_BASE_URL);
	event.locals.pb.authStore.loadFromCookie(cookie || '', COOKIE_NAME);

	try {
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
			event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);

			if (!IS_PRODUCTION) console.log('User:', event.locals.user?.username);
		}
	} catch (_) {
		event.locals.pb.authStore.clear();
		event.locals.user = undefined;

		if (!IS_PRODUCTION) console.log('User: authStore cleared');
	}

	const response = await resolve(event);

	response.headers.set(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({ secure: IS_PRODUCTION, sameSite: 'lax' })
	);

	if (!IS_PRODUCTION) console.log('User:', event.locals.user?.username);

	return response;
}) satisfies Handle;
