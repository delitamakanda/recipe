<script lang="ts">
	import { loading } from '$lib/store/loading';

	$: if ($loading.status === 'NAVIGATING') {
		setTimeout(() => {
			if ($loading.status === 'NAVIGATING') {
				$loading.status = 'LOADING';
			}
		}, 1000);
	}
</script>

{#if $loading.status === 'LOADING'}
	<div
		class="fixed inset-0 top-12 flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-200 z-50">
		<!-- Spinner -->
		<div class="relative w-20 h-20">
			<div class="absolute inset-0 rounded-full border-4 border-gray-300"></div>
			<div
				class="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 border-r-orange-500 animate-spin">
			</div>
		</div>

		<!-- Loading Text -->
		{#if $loading.message}
			<p class="mt-6 text-lg font-semibold text-gray-700 animate-pulse">
				{$loading.message}
			</p>
		{:else}
			<p class="mt-6 text-lg font-semibold text-gray-700 animate-pulse">Loading...</p>
		{/if}
	</div>
{/if}
