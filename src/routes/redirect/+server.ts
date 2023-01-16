import { sqlTimeNow } from '$lib/util';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

const lastSignIn = sqlTimeNow();

export const GET: RequestHandler = async ({ locals, url, cookies }: RequestEvent) => {
	// Get query params
	const query = new URLSearchParams(url.search);
	const qState = query.get('state') || '';
	const qCode = query.get('code') || '';

	// Get cookie
	const cookieOauth = cookies.get('oauth');
	const oauthObject = JSON.parse(cookieOauth ?? '');

	// Assign cookie values to variables
	const cookieProvider = oauthObject.name;
	const cookieState = oauthObject.state;
	const cookieCodeVerifier = oauthObject.codeVerifier;

	if (!cookieProvider) {
		console.log('Provider nicht gefunden');
		throw redirect(303, '/login');
	}

	if (cookieState !== qState) {
		console.log('state entspricht nicht dem cookie', cookieState, qState);
		throw redirect(303, '/login');
	}

	try {
		const reply = await locals.pb
			.collection('users')
			.authWithOAuth2(cookieProvider, qCode, cookieCodeVerifier, `${url.origin}/redirect`, {
				last_signin_at: lastSignIn,
				provider: cookieProvider,
				role: 'Mitglied'
			});

		// UPDARE LAST SIGNIN
		await locals.pb.collection('users').update(reply.record.id, {
			last_signin_at: lastSignIn,
			updated: lastSignIn,
			name: reply.record.username
		});
	} catch (err) {
		console.log('Fehler beim Versuch sich mit 0Auth einzuloggen', err);
	}

	// Protected route
	throw redirect(303, '/my/settings/profile');
};
