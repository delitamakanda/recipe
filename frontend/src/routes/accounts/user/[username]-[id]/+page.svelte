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
	import type { Recipe } from '$lib/interfaces/recipe.interface';
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
	let recipeForm: Recipe = {
		title: '',
		image_url: '',
		preparation_time: 0,
		cooking_time: 0,
		servings: 0,
		ingredients: '',
		instructions: '',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString() as string,
		is_active: true,
		is_private: false,
		is_deleted: false,
		is_published: false,
		is_shared: false,
		rating: 0
	};
	let currentUserData: User;
	$: data?.response,
		(() => {
			currentUserData = data?.response;
			if (updateResponse && updateResponse.user) {
				currentUserData = updateResponse.user;
			}
			console.log('Current user data:', currentUserData);
			if (currentUserData?.id) {
				recipeForm = { ...recipeForm, user: currentUserData?.id };
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

	const handleAddRecipe = async (event: Event) => {
		event.preventDefault();
		if (!recipeForm.user) {
			notificationData.update(() => 'Please select a user.');
			return;
		}
		// Send recipe to the server
		console.log('Adding recipe:', recipeForm);
		const [data, err] = await addRecipe(recipeForm);
		if (err.length <= 0) {
			console.log('Recipe added successfully');
			notificationData.update(() => 'Recipe added successfully.');
			recipeForm = {
				...recipeForm,
				title: '',
				user: currentUserData?.id,
				image_url: '',
				average_rating: 0,
				preparation_time: 0,
				cooking_time: 0,
				servings: 0,
				ingredients: '',
				instructions: '',
				created_at: '',
				updated_at: '',
				is_active: true,
				is_private: false,
				is_deleted: false,
				is_published: false,
				is_shared: false,
				rating: 0
			};
			if (data) {
				recipeUserListData.update((state) => [...state, data as Recipe]);
			}
		} else {
			console.error('Failed to add recipe:', err);
			notificationData.update(() => 'Failed to add recipe. Please try again later.');
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
		<p>
			Image URL: <img
				src={recipe.image_url}
				alt={recipe.title}
				width="auto"
				height="auto" />
		</p>
		<p>Updated at: {recipe.updated_at}</p>
		<p>Created at: {recipe.created_at}</p>
		<p>Preparation Time: {recipe.preparation_time} minutes</p>
		<p>Cooking Time: {recipe.cooking_time} minutes</p>
		<p>Servings: {recipe.servings}</p>
		<p>Instructions: {recipe.instructions}</p>
		<p>Average Rating: {recipe.average_rating}</p>
		<p>Published: {recipe.is_published ? 'Yes' : 'No'}</p>
		<p>Private: {recipe.is_private ? 'Yes' : 'No'}</p>
		<p>Shared: {recipe.is_shared ? 'Yes' : 'No'}</p>
		<p>Is Active: {recipe.is_active ? 'Yes' : 'No'}</p>
		<p>Deleted: {recipe.is_deleted ? 'Yes' : 'No'}</p>
		<p>Ingredients: {recipe.ingredients}</p>
		<p>Rating: {recipe.rating}</p>
		<button on:click={() => handleDeleteRecipe(recipe.id)}>Delete</button>
	{/each}

	<hr />
	<div class="recipe-form" transition:scale|local={{ start: 0.4 }}>
		<h2>Add a new recipe:</h2>
		<form on:submit={handleAddRecipe}>
			<div class="text-input">
				<label for="title">Title:</label>
				<input type="text" id="title" name="title" bind:value={recipeForm.title} />
			</div>

			<div class="text-input">
				<label for="image_url">Image URL:</label>
				<input
					type="text"
					id="image_url"
					name="image_url"
					bind:value={recipeForm.image_url} />
			</div>

			<div class="text-input">
				<label for="ingredients">Ingredients:</label>
				<textarea
					id="ingredients"
					name="ingredients"
					bind:value={recipeForm.ingredients} />
			</div>

			<div class="text-input">
				<label for="preparation_time">Preparation Time (in minutes):</label>
				<input
					type="number"
					id="preparation_time"
					name="preparation_time"
					bind:value={recipeForm.preparation_time} />
			</div>

			<div class="text-input">
				<label for="cooking_time">Cooking Time (in minutes):</label>
				<input
					type="number"
					id="cooking_time"
					name="cooking_time"
					bind:value={recipeForm.cooking_time} />
			</div>

			<div class="text-input">
				<label for="servings">Servings:</label>
				<input
					type="number"
					id="servings"
					name="servings"
					bind:value={recipeForm.servings} />
			</div>

			<div class="text-input">
				<label for="instructions">Instructions:</label>
				<textarea
					id="instructions"
					name="instructions"
					bind:value={recipeForm.instructions} />
			</div>

			<button type="submit">Add Recipe</button>
		</form>
	</div>
</section>
