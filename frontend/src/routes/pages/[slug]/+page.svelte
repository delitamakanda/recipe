<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { PageData } from './$types';
	export let data: PageData;
	import { afterUpdate } from 'svelte';

	$: ({ legalText, slug, timestamp = Date.now() } = data);
	$: key = `${slug}-${timestamp}`;

	afterUpdate(() => {
		// Trigger a re-render after the animation ends
		new Promise((resolve) => setTimeout(resolve, 500));
	});
</script>

<svelte:head>
	<title>{slug}</title>
	<meta charset="utf-8" />
	<meta name="description" content="A simple Svelte app" />
</svelte:head>

{#key key}
	<div
		in:fly={{ y: -100, duration: 500, delay: 500 }}
		out:fly={{ duration: 500 }}
		class="container mx-auto px-4 py-8 max-w-4xl">
		<div class="prose prose-slate max-w-none">
			<div class="white-space-pre-wrap">
				{legalText}
			</div>
		</div>
	</div>
{/key}
