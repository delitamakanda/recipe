import type { Variables } from '$lib/interfaces/variables.interface';

const RECIPES_PER_PAGE: number = 5;

export const variables: Variables = {
	RECIPES_PER_PAGE: RECIPES_PER_PAGE,
	recipeAppUrl: 'https://example.com'
};
