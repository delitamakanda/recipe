<script lang="ts">
	import { fly } from 'svelte/transition';
	import {
		recipeListData,
		recipeSearchTerm,
		currentPage,
		totalPages,
		totalRecipes
	} from '$lib/store/recipe';
	import { fetchRecipes } from '$lib/utils/requestUtils';
	import { onMount } from 'svelte';
	import { notificationData } from '$lib/store/notification';
	import { formatLikes, formatMinutes, formatRating } from '$lib/helpers/formatters';
	import { goto } from '$app/navigation';
	import { firebaseService } from '$lib/services/firebase';

	let searchTerm = '';
	let isLoading = false;

	async function loadRecipes(page: number = 1, searchTerm: string = '') {
		isLoading = true;
		const [paginatedData, error] = await fetchRecipes(searchTerm, page);
		if (error.length !== 0 || !paginatedData) {
			notificationData.update(() => 'Failed to fetch recipes. Please try again later.');
			isLoading = false;
			return;
		}
		recipeListData.set(paginatedData.data);
		currentPage.set(page);
		totalPages.set(paginatedData.totalPages);
		totalRecipes.set(paginatedData.total);
		isLoading = false;
	}

	async function handleSearch(event: Event) {
		const target = event.target as HTMLInputElement;
		searchTerm = target.value;
		recipeSearchTerm.set(searchTerm);

		await firebaseService.resetPagination();
		currentPage.set(1);

		await loadRecipes(1, searchTerm);
	}

	async function handlePageChange(page: number) {
		if (page < 1 || page > $totalPages || isLoading) {
			return;
		}
		await loadRecipes(page, searchTerm);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function getPageNumbers(): (number | string)[] {
		const pages: (number | string)[] = [];
		const maxPagesToShow = 5;
		if ($totalPages <= maxPagesToShow) {
			for (let i = 1; i <= $totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);
			let start = Math.max(2, $currentPage - 1);
			let end = Math.min($totalPages - 1, $currentPage + 1);
			if ($currentPage <= 3) {
				end = 4;
			}
			if ($currentPage >= $totalPages - 2) {
				start = $totalPages - 3;
			}
			if (start > 2) {
				pages.push('...');
			}
			for (let i = start; i <= end; i++) {
				pages.push(i);
			}
			if (end < $totalPages - 1) {
				pages.push('...');
			}
			pages.push($totalPages);
		}
		return pages;
	}

	onMount(async () => {
		await loadRecipes(1);
	});
</script>

<svelte:head>
	<title>Recipes</title>
</svelte:head>
<section
	in:fly={{ y: -100, duration: 500, delay: 500 }}
	out:fly={{ duration: 500 }}
	class="container mx-auto max-w-6xl px-4 py-8">
	<div class="text-center mb-12">
		<h1 class="text-4xl font-bold text-primary mb-2">Recipes</h1>
		<p class="text-gray-600">Find and share delicious recipes</p>
	</div>

	<div class="relative mb-8 max-w-xl mx-auto">
		<input
			type="text"
			placeholder="Search recipes..."
			on:input={handleSearch}
			disabled={isLoading}
			class="w-full px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" />
		<div class="absolute right-4 top-3 text-gray-400">
			{#if isLoading}
				<svg
					class="animate-spin h-6 w-6"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24">
					<circle
						class="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			{/if}
		</div>
	</div>

	<div class="flex flex-col items-center mb-8">
		<div class="text-center text-gray-600 mb-2">
			<p>Total recipes: <span class="font-semibold">{$totalRecipes}</span></p>
			{#if $recipeSearchTerm}
				<p class="mt-2">
					Search results for "<span class="font-semibold">{$recipeSearchTerm}</span>":
					<span class="font-semibold">{$totalRecipes}</span> recipes found
				</p>
			{/if}
			{#if $totalPages > 1}
				<p class="mt-2 text-sm">
					Page <span class="font-semibold">{$currentPage}</span> of
					<span class="font-semibold">{$totalPages}</span>
				</p>
			{/if}
		</div>
	</div>

	{#if $recipeListData.length}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each $recipeListData as recipe}
				<article
					class="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
					<div class="p-6">
						<h2 class="text-xl font-bold mb-3 text-gray-800">{recipe.title}</h2>
						<div class="flex flex-wrap gap-4 mb-4 text-sm">
							{#if recipe.image_url}
								<img
									class="w-full h-48 object-cover"
									src={recipe.image_url}
									alt={recipe.title} />
							{/if}
							<div class="flex items-center text-gray-600">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 mr-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<span>Prep: {formatMinutes(+recipe.preparation_time)}</span>
							</div>

							<div class="flex items-center text-gray-600">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 mr-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
								<span>Cook: {formatMinutes(+recipe.cooking_time)}</span>
							</div>
						</div>

						<div class="flex items-center mb-5">
							<div class="flex items-center text-yellow-500">
								{#each Array.from({ length: 5 }) as i}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										viewBox="0 0 20 20"
										fill={i < Math.floor(recipe.rating) ? 'currentColor' : 'none'}>
										<path
											d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								{/each}
								<span class="ml-1 text-gray-600">{formatRating(recipe.rating)}</span>
							</div>
							<div class="ml-auto flex items-center text-gray-600">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 mr-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
								</svg>
								<span>{formatLikes(recipe.total_likes)}</span>
							</div>
						</div>

						<button
							class="w-full py-2 px-4 bg-primary hover:bg-primary-focus text-white font-semibold rounded-md transition-colors duration-200"
							on:click={() => goto(`/${recipe.id}`)}>View recipe details</button>
					</div>
				</article>
			{/each}
		</div>

		<!-- Pagination Controls -->
		{#if $totalPages > 1}
			<div class="flex justify-center items-center gap-2 mt-8">
				<!-- Previous Button -->
				<button
					on:click={() => handlePageChange($currentPage - 1)}
					disabled={$currentPage === 1 || isLoading}
					class="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1">
					<span class="hidden sm:inline">Previous</span>
				</button>

				<!-- Page Numbers -->
				<div class="flex gap-1">
					{#each getPageNumbers() as page}
						{#if page === '...'}
							<span class="px-4 py-2 text-gray-500">...</span>
						{:else}
							<button
								on:click={() => handlePageChange(page)}
								disabled={isLoading}
								class="px-4 py-2 rounded-md border transition-colors duration-200 {$currentPage ===
								page
									? 'bg-primary text-white border-primary'
									: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} disabled:opacity-50 disabled:cursor-not-allowed">
								{page}
							</button>
						{/if}
					{/each}
				</div>

				<!-- Next Button -->
				<button
					on:click={() => handlePageChange($currentPage + 1)}
					disabled={$currentPage === $totalPages || isLoading}
					class="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:
                            opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1">
					<span class="hidden sm:inline">Next</span>
				</button>
			</div>
		{/if}
	{:else}
		<div class="text-center py-16">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-16 w-16 mx-auto text-gray-400 mb-4"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<p class="text-xl text-gray-600">No recipes</p>
			<p class="text-gray-500 mt-2">Try a different keyword or come back later...</p>
		</div>
	{/if}
</section>
