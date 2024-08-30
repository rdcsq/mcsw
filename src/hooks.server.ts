import { generateJwt, verifyAccessJwt, verifyRefreshJwt } from '$lib/auth';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/signin')) {
		return await resolve(event);
	}

    // session is active
	const accessToken = event.cookies.get('access_token');
	if (accessToken && await verifyAccessJwt(accessToken)) {
        return await resolve(event);
	}

    // refresh token if its active
    const refreshToken = event.cookies.get('refresh_token')
    if (refreshToken && await verifyRefreshJwt(refreshToken)) {
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
        return await resolve(event);
    }

    // send to login
    redirect(302, '/signin');
};
