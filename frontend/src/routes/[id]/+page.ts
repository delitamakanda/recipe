import type { PageLoad } from './$types';
import { fetchRecipe } from '$lib/utils/requestUtils';
import type { Recipe } from '$lib/interfaces/recipe.interface';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params: { id } }) => {
	try {
		const [recipe, errors] = await fetchRecipe(id);
		console.log('Recipe:', recipe);
		if (!recipe) {
			throw error(404, {
				message: 'Recipe not found'
			});
		}

		const recipeResponse = recipe as Recipe;
		console.log('Errors:', errors);
		console.log('Recipe data:', recipeResponse);

		if (
			!recipeResponse.title ||
			!recipeResponse.instructions ||
			!recipeResponse.ingredients.length
		) {
			throw error(400, {
				message: 'Invalid recipe data'
			});
		}

		return {
			recipeResponse
		};
	} catch (error: { status: number; body: unknown }) {
		console.error(error);
		if (error.status && error.body) {
			throw error;
		}
		throw error(500, {
			message: 'Failed to load recipe'
		});
	}
};
