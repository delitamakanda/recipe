<script lang="ts">
	import { onMount } from 'svelte';
	import { syncService } from '$lib/services/sync';
	import { firebaseService } from '$lib/services/firebase';
	import type { Recipe } from '$lib/interfaces/recipe.interface';
	import { page } from '$app/stores';

	let recipe: Recipe = {
		id: '',
		title: '',
		ingredients: '',
		instructions: '',
		image_url: '',
		is_published: false,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	};

	let isLoading = true;
	let imageFile: File | null = null;

	onMount(async () => {
		const recipeId = $page.params.id;
		if (recipeId !== 'new') {
			const loadedRecipe = await syncService.getRecipe(recipeId);
			if (loadedRecipe) {
				recipe = loadedRecipe;
			}
		}
		isLoading = false;
	});

	async function handleSubmit() {
		isLoading = true;

		try {
			// Si une nouvelle image a été sélectionnée, téléchargez-la d'abord
			if (imageFile) {
				// Si nous avons un ID de recette existant et une URL d'image existante, supprimez l'ancienne image
				if (recipe.id && recipe.image_url) {
					//await firebaseService.deleteRecipeImage(recipe.image_url);
				}

				// Télécharger la nouvelle image
				const imageUrl = await firebaseService.uploadImage(imageFile);
				recipe.image_url = imageUrl;
			}

			if (recipe.id) {
				// Mise à jour d'une recette existante
				await syncService.updateRecipe(recipe);
			} else {
				// Ajout d'une nouvelle recette
				const newId = await syncService.addRecipe(recipe);
				recipe.id = newId;
			}

			// Rediriger vers la page de détail de la recette
			window.location.href = `/recipes/${recipe.id}`;
		} catch (error) {
			console.error('Failed to save recipe', error);
			alert('Failed to save recipe. Please try again.');
		} finally {
			isLoading = false;
		}
	}

	function handleImageChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			imageFile = input.files[0];
		}
	}
</script>

<div class="container">
	<h1>{recipe.id ? 'Edit Recipe' : 'New Recipe'}</h1>

	{#if isLoading}
		<p>Loading...</p>
	{:else}
		<form on:submit|preventDefault={handleSubmit}>
			<div class="form-group">
				<label for="title">Title</label>
				<input type="text" id="title" bind:value={recipe.title} required />
			</div>

			<div class="form-group">
				<label for="ingredients">Ingredients</label>
				<textarea id="ingredients" bind:value={recipe.ingredients} required></textarea>
			</div>

			<div class="form-group">
				<label for="instructions">Instructions</label>
				<textarea id="instructions" bind:value={recipe.instructions} required></textarea>
			</div>

			<div class="form-group">
				<label for="image">Recipe Image</label>
				<input
					type="file"
					id="image"
					accept="image/jpeg, image/png"
					bind:value={imageFile}
					on:change={handleImageChange} />
			</div>
			<div class="form-group">
				<button type="submit" disabled={isLoading}>
					{recipe.id ? 'Save Recipe' : 'Add Recipe'}
				</button>
				<a href="/recipes">Cancel</a>
			</div>
		</form>
	{/if}
</div>
