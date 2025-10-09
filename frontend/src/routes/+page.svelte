<script lang="ts">
	import { fly } from 'svelte/transition';
	import { recipeListData, recipeSearchTerm } from '$lib/store/recipe';
	import { fetchRecipes } from '$lib/utils/requestUtils';
	import { onMount } from 'svelte';
	import { notificationData } from '$lib/store/notification';
	import { formatLikes, formatMinutes } from '$lib/helpers/formatters';
	import { goto } from '$app/navigation';

	let searchTerm = '';

	async function handleSearch(event: Event) {
		const target = event.target as HTMLInputElement;
		searchTerm = target.value;
		recipeSearchTerm.set(searchTerm);
		const [recipes, error] = await fetchRecipes(searchTerm);
		if (error.length !== 0) {
			// Display an error message or handle the error appropriately
			notificationData.update(
				() => 'Failed to search for recipes. Please try again later.'
			);
			recipeSearchTerm.set(''); // Clear the search term after fetching recipes to avoid unnecessary updates
			return;
		}
		recipeListData.set(recipes);
	}

	onMount(async () => {
		const [recipes, error] = await fetchRecipes();
		if (error.length === 0) {
			recipeListData.set(recipes);
			recipeSearchTerm.set(''); // Clear the search term after fetching recipes to avoid unnecessary updates
		} else {
			console.error('Failed to fetch recipes:', error);
			// Display an error message or handle the error appropriately
			notificationData.update(() => 'Failed to fetch recipes. Please try again later.');
		}
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
			class="w-full px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm" />
		<div class="absolute right-4 top-3 text-gray-400">
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
		</div>
	</div>

	<div class="flex flex-col items-center mb-8">
		<div class="text-center text-gray-600 mb-2">
			<p>Total recipes: <span class="font-semibold">{$recipeListData.length}</span></p>
			{#if $recipeSearchTerm}
				<p class="mt-2">
					Search results for "<span class="font-semibold">{$recipeSearchTerm}</span>":
					<span class="font-semibold">{$recipeListData.length}</span> recipes found
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
								<span class="ml-1 text-gray-600">{recipe.rating}</span>
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
