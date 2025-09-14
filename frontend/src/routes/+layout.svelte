<script lang="ts">
	import '../app.css';
	import { userData } from '$lib/store/user';
	import { navigating } from '$app/stores';
	import { loading } from '$lib/store/loading';
	import { notificationData } from '$lib/store/notification';
	import { fly } from 'svelte/transition';
	import { onMount, afterUpdate, onDestroy } from 'svelte';
	import { getUser, setupAuthListener, browserGet } from '$lib/utils/requestUtils';

	import Header from '$lib/components/Header/Header.svelte';
	import Loader from '$lib/components/Loader/Loader.svelte';

	$: loading.setNavigate(!!$navigating);
	$: loading.setLoading(!!$navigating, 'Loading, please wait...');

	let unsubscribeAuth: (() => void) | null = null;

	onMount(async () => {
		// Set up Firebase auth state listener
		unsubscribeAuth = setupAuthListener((user) => {
			if (user) {
				userData.set(user as never);
			} else {
				userData.set(null as never);
			}
		});

		// If we're already authenticated according to local storage, try to get user data
		if (browserGet('isAuthenticated') === 'true') {
			const [response, err] = await getUser();
			if (err.length <= 0 && response) {
				userData.set(response as never);
			}
		}
	});

	onDestroy(() => {
		// Clean up the auth listener when component is destroyed
		if (unsubscribeAuth) {
			unsubscribeAuth();
		}
	});

	afterUpdate(async () => {
		const notifyEl = document.getElementById('notify') as HTMLElement;
		if (notifyEl && $notificationData !== '') {
			setTimeout(() => {
				notifyEl.classList.add('disappear');
				notificationData.set('');
			}, 2000);
		}

		// Only update user data if we're authenticated
		if (browserGet('isAuthenticated') === 'true') {
			const [response, err] = await getUser();
			if (err.length <= 0 && response) {
				userData.update(() => response as never);
			}
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
