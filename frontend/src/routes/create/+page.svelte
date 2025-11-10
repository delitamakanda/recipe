<script lang="ts">
	import { syncService } from '$lib/services/sync';
	import type { Recipe } from '$lib/interfaces/recipe.interface';
	import { getDeviceId } from '$lib/utils/deviceId';
	import { goto } from '$app/navigation';

	let errors: { [key: string]: string } = {};
	let isSubmitting = false;
	let hasErrors = false;
	let imageFile: File | null = null;

	let recipe: Recipe = {
		id: '',
		user: '',
		title: '',
		image_url: '',
		average_rating: 0,
		servings: 1,
		preparation_time: 0,
		cooking_time: 0,
		ingredients: '',
		intro: '',
		instructions: '',
		is_published: false,
		is_active: true,
		is_deleted: false,
		is_private: false,
		is_shared: false,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		rating: 0,
		total_likes: 0,
		liked_by: []
	};

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			imageFile = file;
			const reader = new FileReader();
			reader.onload = (loadEvent) => {
				recipe.image_url = loadEvent?.target!.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	async function createRecipe() {
		try {
			isSubmitting = true;
			errors = {};
			hasErrors = false;
			if (!recipe.title) {
				errors.title = 'Title is required';
				hasErrors = true;
			}
			if (!recipe.ingredients) {
				errors.ingredients = 'Ingredients are required';
				hasErrors = true;
			}
			if (!recipe.instructions) {
				errors.instructions = 'Instructions are required';
				hasErrors = true;
			}
			if (hasErrors) {
				return;
			}
			const deviceId = getDeviceId();
			const now = new Date().toISOString();
			recipe.id =
				new Date().getTime().toString(36) + Math.random().toString(36).substr(2);
			recipe.user = deviceId;
			recipe.created_at = now;
			recipe.updated_at = now;
			if (imageFile) {
				recipe.image_url = await syncService.uploadImage(imageFile);
			}

			const recipeId = await syncService.addRecipe(recipe);
			goto(`/${recipeId}`);
		} catch (error) {
			errors = {
				general: 'Erreur lors de la création de la recette. Veuillez réessayer plus tard.'
			};
			console.error('Error creating recipe:', error);
		} finally {
			isSubmitting = false;
			if (!Object.keys(errors).length) {
				recipe = {
					id: '',
					user: '',
					title: '',
					image_url: '',
					average_rating: 0,
					servings: 1,
					intro: '',
					preparation_time: 0,
					cooking_time: 0,
					ingredients: '',
					instructions: '',
					is_published: false,
					is_active: true,
					is_deleted: false,
					is_private: false,
					is_shared: false,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
					rating: 0,
					total_likes: 0,
					liked_by: []
				};
				imageFile = null;
			}
		}
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-6">Créer une recette</h1>

	{#if Object.keys(errors).length > 0}
		{#each Object.entries(errors) as [key, error]}
			<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
				{key} : {error}
			</div>
		{/each}
	{/if}

	<form on:submit|preventDefault={createRecipe} class="space-y-6">
		<div>
			<label for="title" class="block mb-2">Title*</label>
			<input
				type="text"
				id="title"
				bind:value={recipe.title}
				class="w-full p-2 border rounded"
				required />
		</div>

		<div>
			<label for="intro" class="block mb-2">Introduction (Optionnel)</label>
			<textarea
				id="intro"
				bind:value={recipe.intro}
				rows="3"
				class="w-full p-2 border rounded" />
		</div>

		<div>
			<label for="imageFile" class="block mb-2">Image URL</label>
			<input
				type="file"
				id="imageFile"
				on:change={handleFileChange}
				class="w-full p-2 border rounded" />
			{#if recipe.image_url}
				<div class="mt-4">
					<img
						class="max-w-xs object-cover rounded"
						src={recipe.image_url}
						alt="recipe overview" />
				</div>
			{/if}
		</div>

		<div class="grid grid-cols-3 gap-4">
			<div>
				<label for="preparationTime" class="block mb-2">Preparation time (min)</label>
				<input
					type="number"
					id="preparationTime"
					bind:value={recipe.preparation_time}
					min="0"
					class="w-full p-2 border rounded" />
			</div>

			<div>
				<label for="cookingTime" class="block mb-2">Cooking time (min)</label>
				<input
					type="number"
					id="cookingTime"
					bind:value={recipe.cooking_time}
					min="0"
					class="w-full p-2 border rounded" />
			</div>

			<div>
				<label for="servings" class="block mb-2">Servings</label>
				<input
					type="number"
					id="servings"
					bind:value={recipe.servings}
					min="1"
					class="w-full p-2 border rounded" />
			</div>
		</div>

		<div>
			<label for="ingredients" class="block mb-2">Ingredients (one per line)</label>
			<textarea
				id="ingredients"
				bind:value={recipe.ingredients}
				rows="5"
				class="w-full p-2 border rounded"
				placeholder="200g de farine
3 œufs
100g de sucre"></textarea>
		</div>

		<div>
			<label for="instructions" class="block mb-2"
				>Instructions (one step per line)</label>
			<textarea
				id="instructions"
				bind:value={recipe.instructions}
				rows="15"
				class="w-full p-2 border rounded"
				placeholder="Mélanger les ingrédients secs.
Ajouter les œufs et mélanger.
Cuire pendant 30 minutes."></textarea>
		</div>

		<div class="flex items-center">
			<input
				type="checkbox"
				id="isPrivate"
				bind:checked={recipe.is_private}
				class="mr-2" />
			<label for="isPrivate">Private recipe</label>
		</div>

		<div>
			<button
				type="submit"
				class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
				disabled={isSubmitting}>
				{isSubmitting ? 'Creation in progress' : 'Create a recipe'}
			</button>
		</div>
	</form>
</div>
