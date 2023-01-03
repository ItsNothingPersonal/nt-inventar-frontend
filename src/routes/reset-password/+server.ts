import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	await locals.pb.collection('users').requestPasswordReset(locals.user?.email);
	locals.pb.authStore.clear();
	locals.user = undefined;

	throw redirect(303, '/login');
};
