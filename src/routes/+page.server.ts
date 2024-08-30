import { env } from '$env/dynamic/private';
import { deleteMod, listMods, restartMinecraftServer } from '$lib/minecraft';
import type { Actions } from '@sveltejs/kit';
import path from 'node:path';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const mods = await listMods();
	return { mods };
}

export const actions: Actions = {
	restart: async () => {
		await restartMinecraftServer();
	},
	delete: async (event) => {
		const formData = await event.request.formData();
		const modName = formData.get('modName')?.toString();
		if (typeof modName !== 'string') {
			return { success: false };
		}
		const res = await deleteMod(modName);
		console.log(res)
		return { success: res };
	},
	upload: async (event) => {
		const formData = await event.request.formData();
		const file = formData.get('file') as File;
		if (!file) {
			return { success: false };
		}
		try {
			await Bun.write(path.join(env.MINECRAFT_FOLDER, 'mods', file.name), file);
			return { success: true };
		} catch (e) {
			console.error(e);
			return { success: false };
		}
	}
};
