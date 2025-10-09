<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { PageData } from './$types';
	export let data: PageData;
	const { legalText, slug } = data as { legalText: string; slug: string };
</script>

<svelte:head>
	<title>{slug}</title>
	<meta charset="utf-8" />
	<meta name="description" content="A simple Svelte app" />
</svelte:head>

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
