<script lang="ts">
	import { onMount } from 'svelte';
	import { browserSet, browserGet } from '$lib/utils/requestUtils';

	let showBanner: boolean = false;

	onMount(() => {
		const bannerCookie = browserGet('banner-cookie');
		if (bannerCookie === 'true') {
			showBanner = false;
		} else {
			showBanner = true;
			browserSet('banner-cookie', 'true');
		}
	});

	function acceptBanner() {
		browserSet('banner-cookie', 'true');
		showBanner = false;
	}

	function closeBanner() {
		showBanner = false;
		browserSet('banner-cookie', 'false');
	}
</script>

{#if showBanner}
	<div
		class="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 z-50 border-t border-gray-200">
		<h2>Important Notice</h2>
		<p>
			This website uses cookies to improve your experience. By continuing to use this
			site, you agree to our <a
				href="/pages/cookie-policy"
				class="text-blue-600 hover:underline">cookie policy</a
			>.
		</p>
		<button
			class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
			on:click={acceptBanner}>Accept</button>
		<button
			class="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
			on:click={closeBanner}>Close</button>
	</div>
{/if}
