<script lang="ts">
	import { fly } from 'svelte/transition';
	import { userData } from '$lib/store/user';
	import { recipeListData, recipeSearchTerm } from '$lib/store/recipe';
	import { fetchRecipes } from '$lib/utils/requestUtils';
	import { onMount } from 'svelte';
	import { notificationData } from '$lib/store/notification';
	import { formatLikes, formatMinutes } from '$lib/helpers/formatters';

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
	class="flex w-full flex-col items-center gap-12 p-7">
	<h1>Recipes</h1>
	{#if $userData.username}
		Hello, {$userData.username} !
	{/if}
	<input type="text" placeholder="Search recipes..." on:input={handleSearch} />
	<p>Total recipes: {$recipeListData.length}</p>
	{#if $recipeSearchTerm}
		<p>
			Search results for "{$recipeSearchTerm}": {$recipeListData.length} recipes found
		</p>
	{/if}
	{#if $recipeListData.length}
		{#each $recipeListData as recipe}
			<article>
				<h2>{recipe.title}</h2>
				<p>{formatMinutes(+recipe.preparation_time)}</p>
				<p>{formatMinutes(+recipe.cooking_time)}</p>
				<p>{recipe.rating} {formatLikes(recipe.total_likes)}</p>
				<button on:click={() => alert(`You clicked on ${recipe.title}`)}
					>View Recipe</button>
			</article>
		{/each}
	{:else}
		<p>No recipes</p>
	{/if}
</section>
