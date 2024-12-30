<script lang="ts">
	import { scale } from 'svelte/transition';
	import {
		updateField,
		addRecipe,
		deleteRecipe,
		fetchUserRecipes
	} from '$lib/utils/requestUtils';
	import { nodeBefore } from '$lib/helpers/whiteSpaces';
	import type { User, UserResponse } from '$lib/interfaces/user.interface';
	import { variables } from '$lib/utils/constants';
	export let data: { response: User };
	import { recipeUserListData } from '$lib/store/recipe';
	import { onMount } from 'svelte';
	import { notificationData } from '$lib/store/notification';

	const url = `${variables.BASE_API_URL}/user/`;

	let updateResponse: UserResponse;
	let triggerUpdate = async (e: Event) => {
		const sibling = nodeBefore(<HTMLElement>e.target);
		if (sibling) {
			const [res, err] = await updateField(sibling.name, sibling.value, url);
			if (err.length <= 0) {
				updateResponse = res as UserResponse;
			}
		}
	};
	let currentUserData: User;
	$: data?.response,
		(() => {
			currentUserData = data?.response;
			if (updateResponse && updateResponse.user) {
				currentUserData = updateResponse.user;
			}
		})();

	const handleDeleteRecipe = async (recipeId: string | undefined) => {
		// Send recipe deletion request to the server
		const [, err] = await deleteRecipe(recipeId);
		if (err.length <= 0) {
			console.log('Recipe deleted successfully');
			recipeUserListData.update((state) =>
				state.filter((recipe) => recipe?.id !== recipeId)
			);
		} else {
			console.error('Failed to delete recipe:', err);
		}
	};

	const handleAddRecipe = async () => {
		// Send recipe to the server
		const [, err] = await addRecipe({
			user: currentUserData.id,
			title: 'New Recipe',
			preparation_time: 15,
			cooking_time: 15,
			servings: 4,
			instructions: 'Instructions 1',
			rating: 5,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			is_active: true,
			is_private: false,
			is_deleted: false,
			is_published: true,
			is_shared: false,
			likes: 0,
			ingredients: 'Ingredient 1'
		});
		if (err.length <= 0) {
			console.log('Recipe added successfully');
		} else {
			console.error('Failed to add recipe:', err);
		}
	};

	onMount(async () => {
		const [recipes, error] = await fetchUserRecipes();
		if (error.length === 0) {
			recipeUserListData.set(recipes);
		} else {
			console.error('Failed to fetch recipes:', error);
			// Display an error message or handle the error appropriately
			notificationData.update(() => 'Failed to fetch recipes. Please try again later.');
		}
	});
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<section
	class="flex w-full flex-col items-center gap-12 p-7"
	transition:scale|local={{ start: 0.7, duration: 500, delay: 500 }}>
	{#if currentUserData?.id}
		<h1>{currentUserData?.username} profile</h1>
	{/if}

	<div class="user-details" transition:scale|local={{ start: 0.2 }}>
		<div class="text-input">
			<label for="username">Username:</label>
			<input
				type="text"
				id="username"
				name="username"
				value={currentUserData?.username} />
			<button on:click={(e) => triggerUpdate(e)}>Update</button>
		</div>
	</div>
	<div class="user-details" transition:scale|local={{ start: 0.3 }}>
		<div class="text-input">
			<label for="email">Email:</label>
			<input type="text" id="email" name="email" value={currentUserData?.email} />
			<button on:click={(e) => triggerUpdate(e)}>Update</button>
		</div>
	</div>
	<hr />
	<h2>Your Recipes:</h2>
	{#each $recipeUserListData as recipe}
		<h3>{recipe.title}</h3>
		<p>Ingredients: {recipe.ingredients}</p>
		<p>Rating: {recipe.rating}</p>
		<button on:click={() => handleDeleteRecipe(recipe.id)}>Delete</button>
	{/each}

	<hr />
	<div class="recipe-form" transition:scale|local={{ start: 0.4 }}>
		<h2>Add a new recipe:</h2>
		<div class="text-input">
			<input type="text" id="recipe-title" placeholder="Recipe Title" />
		</div>
		<div class="text-input">
			<textarea
				id="recipe-ingredients"
				placeholder="Recipe Ingredients"
				rows="10"
				style="width: 100%;"></textarea>
		</div>
		<div class="text-input">
			<textarea
				id="recipe-instructions"
				placeholder="Recipe Instructions"
				rows="10"
				style="width: 100%;"></textarea>
		</div>
		<div class="text-input">
			<input type="text" id="recipe-prep-time" placeholder="Prep Time (in minutes)" />
		</div>
		<div class="text-input">
			<input type="text" id="recipe-cook-time" placeholder="Cook Time (in minutes)" />
		</div>
		<div class="text-input">
			<input type="text" id="recipe-servings" placeholder="Servings" />
		</div>
		<button on:click={handleAddRecipe}>Add Recipe</button>
	</div>
</section>
