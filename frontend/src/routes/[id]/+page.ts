import type { PageLoad } from './$types';
import type { Recipe } from '$lib/interfaces/recipe.interface';
import { error } from '@sveltejs/kit';
import { fetchRecipe } from '$lib/utils/requestUtils';

const validateRecipe = (recipe: Recipe): boolean => {
	return !!(recipe.title && recipe.instructions && recipe.ingredients?.length);
};

export const load: PageLoad = async ({ params: { id } }) => {
	try {
		const [recipe, errors] = await fetchRecipe(id);

		if (!recipe) {
			throw error(404, {
				message: 'Recipe not found'
			});
		}

		const recipeResponse = recipe as Recipe;

		if (!validateRecipe(recipeResponse)) {
			throw error(400, {
				message: 'Invalid recipe data'
			});
		}

		if (errors && errors.length > 0) {
			console.error('Errors:', errors);
		}

		return {
			recipeResponse
		};
	} catch (err) {
		if (err instanceof Error && 'status' in err && 'body' in err) {
			throw err;
		}
		throw error(500, {
			message: 'Failed to load recipe'
		});
	}
};
