import { generateJwt, verifyPassword } from '$lib/auth';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const password = data.get('password')?.toString();
		if (typeof password !== 'string' || !verifyPassword(password)) {
			return { success: false };
		}
		const session = await generateJwt();
		event.cookies.set('access_token', session.accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/'
		});
		event.cookies.set('refresh_token', session.refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/'
		});
		return redirect(302, '/');
	}
};
