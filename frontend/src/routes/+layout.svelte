<script lang="ts">
	import '../output.css';
	import { userData } from '$lib/store/user';
	import { navigating } from '$app/stores';
	import { loading } from '$lib/store/loading';
	import { notificationData } from '$lib/store/notification';
	import { fly } from 'svelte/transition';
	import { onMount, afterUpdate } from 'svelte';

	import Header from '$lib/components/Header/Header.svelte';
	import Loader from '$lib/components/Loader/Loader.svelte';

	$: loading.setNavigate(!!$navigating);
	$: loading.setLoading(!!$navigating, 'Loading, please wait...');

	import { getUser, browserGet } from '$lib/utils/requestUtils';
	import { variables } from '$lib/utils/constants';

	onMount(async () => {
		if (browserGet('refreshToken')) {
			const [response, err] = await getUser(
				fetch,
				`${variables.BASE_API_URL}/token/refresh/`,
				`${variables.BASE_API_URL}/user/`
			);
			if (err.length <= 0) {
				userData.set(response as never);
			}
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
		if (browserGet('refreshToken')) {
			const [response] = await getUser(
				fetch,
				`${variables.BASE_API_URL}/token/refresh/`,
				`${variables.BASE_API_URL}/user/`
			);
			userData.update(() => response as never);
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
