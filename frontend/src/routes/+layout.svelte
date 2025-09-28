<script lang="ts">
	import '../app.css';
	import { navigating } from '$app/stores';
	import { loading } from '$lib/store/loading';
	import { notificationData } from '$lib/store/notification';
	import { fly } from 'svelte/transition';
	import { onMount, afterUpdate, onDestroy } from 'svelte';

	import Header from '$lib/components/Header/Header.svelte';
	import Loader from '$lib/components/Loader/Loader.svelte';

	$: loading.setNavigate(!!$navigating);
	$: loading.setLoading(!!$navigating, 'Loading, please wait...');
	onMount(async () => {});

	onDestroy(() => {});

	afterUpdate(async () => {
		const notifyEl = document.getElementById('notify') as HTMLElement;
		if (notifyEl && $notificationData !== '') {
			setTimeout(() => {
				notifyEl.classList.add('disappear');
				notificationData.set('');
			}, 2000);
		}
	});
</script>

<Header />

{#if $notificationData}
	<div
		class="notify"
		id="notify"
		in:fly={{ x: 200, duration: 500, delay: 300 }}
		out:fly={{ x: 200, duration: 500, delay: 300 }}>
		{$notificationData}
	</div>
{/if}

<main>
	<Loader />
	<slot />
</main>

<footer in:fly={{ y: -50, duration: 500, delay: 500 }} out:fly={{ duration: 500 }}>
	<p>
		&copy; {new Date().getFullYear()}
	</p>
</footer>
