import { env } from '$env/dynamic/private';
import { TimeSpan } from 'oslo';
import { createJWT, validateJWT } from 'oslo/jwt';

const secrets = initSecrets();

function initSecrets() {
	const textEncoder = new TextEncoder();
	return {
		access: textEncoder.encode(env.JWT_ACCESS_SECRET),
		refresh: textEncoder.encode(env.JWT_REFRESH_SECRET)
	};
}

const storedPassword = env.PASSWORD;

export function verifyPassword(password: string): boolean {
	return (
		typeof storedPassword === 'string' && storedPassword.length > 0 && storedPassword == password
	);
}

export async function generateJwt() {
	const [accessToken, refreshToken] = await Promise.all([
		createJWT(
			'HS256',
			secrets.access,
			{},
			{
				expiresIn: new TimeSpan(5, 'm')
			}
		),
		createJWT(
			'HS256',
			secrets.refresh,
			{},
			{
				expiresIn: new TimeSpan(1, 'h')
			}
		)
	]);
	return {
		accessToken,
		refreshToken
	};
}

export async function verifyAccessJwt(jwt: string): Promise<boolean> {
	try {
		await validateJWT('HS256', secrets.access, jwt);
		return true;
	} catch {
		return false;
	}
}

export async function verifyRefreshJwt(jwt: string): Promise<boolean> {
	try {
		await validateJWT('HS256', secrets.refresh, jwt);
		return true;
	} catch {
		return false;
	}
}
