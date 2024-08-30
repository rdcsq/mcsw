<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let item: string | null = null;
	let files: FileList;
	let fileInput: HTMLInputElement;

	$: if (files) {
		const formData = new FormData();
		formData.append('file', files[0]);
		fetch('?/upload', {
			method: 'POST',
			body: formData
		}).then(() => location.reload());
	}
</script>

<main class="max-w-2xl w-full mx-auto my-0 p-6 flex flex-col gap-4">
	<form method="post" action="?/restart">
		<button type="submit" class="bg-violet-500 text-white rounded-md w-full p-2"
			>Reiniciar servidor</button
		>
	</form>

	<div class="h-px bg-gray-500 w-full"></div>
	<h1 class="text-lg font-bold">Mods</h1>
	{#if data.mods}
		<input
			hidden
			type="file"
			bind:this={fileInput}
			bind:files
			accept="application/java-archive"
			multiple={false}
		/>
		<button
			class="bg-violet-500 text-white rounded-md w-full p-2"
			on:click={() => fileInput.click()}>Subir mod</button
		>

		<table class="border table-fixed">
			<thead class="bg-black/10">
				<tr>
					<th>Mod</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.mods as mod}
					<tr class="border-b">
						<td class="border-r p-2">{mod}</td>
						<td class="flex gap-2 justify-center">
							<button
								on:click={() => (item = mod)}
								class="aspect-square bg-red-500 text-white flex size-10 items-center justify-center rounded-md"
							>
								<i class="i-bi-trash-fill text-xl"></i>
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<ul class="list-inside list-disc"></ul>
	{:else}
		<p>Ocurrió un error an leer la lista de mods</p>
	{/if}
</main>

{#if item != null}
	<div class="absolute top-0 left-0 min-h-svh w-svw bg-black/50 flex items-center justify-center">
		<form
			method="post"
			action="?/delete"
			class="flex flex-col max-w-2xl w-full bg-white rounded-md p-6"
		>
			<h1 class="text-xl font-bold">Eliminar mod</h1>
			<input hidden name="modName" value={item} />
			<p>{item}</p>
			<div class="flex justify-end gap-4">
				<button class="rounded-md p-2" on:click={() => (item = null)}>Salir</button>
				<button type="submit" class="bg-red-500 text-white rounded-md p-2">Eliminar</button>
			</div>
		</form>
	</div>
{/if}

<style>
	td,
	th {
		@apply p-2;
	}
</style>
