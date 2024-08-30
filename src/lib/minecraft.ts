import { env } from '$env/dynamic/private';
import fs from 'node:fs/promises';
import path from 'node:path';
import { exec } from 'node:child_process';

export async function listMods(): Promise<string[] | undefined> {
	try {
		const files = await fs.readdir(path.join(env.MINECRAFT_FOLDER, 'mods'));
		return files.filter((file) => file.endsWith('.jar'));
	} catch (e) {
		console.error(e);
		return;
	}
}

export async function deleteMod(name: string) {
	try {
		await fs.unlink(path.join(env.MINECRAFT_FOLDER, 'mods', name));
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
}

export async function restartMinecraftServer() {
	try {
		await new Promise((resolve, reject) => {
			exec(env.MINECRAFT_RESTART_CMD, (error, stdout, stderr) => {
				if (error) {
					reject(error);
				}
				resolve({ stdout, stderr });
			});
		});
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
}
