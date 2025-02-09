import type { PageLoad } from './$types';
import { fetchRecipe } from '$lib/utils/requestUtils';
import type { Recipe } from '$lib/interfaces/recipe.interface';

export const load: PageLoad = async ({ params: { id } }) => {
	const [recipe, error] = await fetchRecipe(id);

	const recipeResponse: Recipe | undefined = recipe as Recipe | undefined;

	if (error.length > 0 && !recipeResponse?.id) {
		return {
			redirect: '/',
			status: 302
		};
	}

	return {
		recipeResponse
	};
};
