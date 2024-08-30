<script lang="ts">
	import type { ActionData } from "./$types";

	export let form: ActionData;
</script>

<div class="min-h-svh w-full flex items-center justify-center">
	<form method="post" class="max-w-2xl w-full p-6 flex gap-2">
		<input
			type="password"
			name="password"
			class={`w-full border rounded-lg p-2 ${form && !form.success ? "border-red-500" : ""}`}
			placeholder="Contraseña"
		/>
		<button
			type="submit"
			class="aspect-square bg-violet-500 text-white flex size-10 items-center justify-center rounded-md"
		>
			<i class="i-bi-arrow-right-short text-2xl"></i>
		</button>
	</form>
</div>
