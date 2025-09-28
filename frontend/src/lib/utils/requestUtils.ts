import type { CustomError } from '$lib/interfaces/error.interface';
import { notificationData } from '$lib/store/notification';
import type { Recipe } from '$lib/interfaces/recipe.interface';
import { syncService } from '$lib/services/sync';
import { browser } from '$app/environment';

export const fetchRecipes = async (
	searchTerm: string = ''
): Promise<[Array<Recipe>, Array<CustomError>]> => {
	try {
		const recipes = await syncService.getRecipes(searchTerm);
		return [recipes, []];
	} catch {
		notificationData.update(() => 'Failed to fetch recipes');
		return [[], [{ error: 'Failed to fetch recipes' }]];
	}
};

export const fetchRecipe = async (
	recipeId: string
): Promise<[object, Array<CustomError>]> => {
	try {
		const response = await syncService.getRecipe(recipeId);
		if (!response) {
			notificationData.update(() => 'Recipe not found');
			return [{}, [{ error: 'Recipe not found' }]];
		}
		return [response, []];
	} catch {
		notificationData.update(() => 'Failed to fetch recipe');
		return [{}, [{ error: 'Failed to fetch recipe' }]];
	}
};

export const addRecipe = async (
	recipe: Recipe
): Promise<[object, Array<CustomError>]> => {
	try {
		const recipeId = await syncService.addRecipe(recipe);
		notificationData.update(() => 'Recipe has been added');
		return [{ ...recipe, id: recipeId }, []];
	} catch {
		notificationData.update(() => 'Failed to add recipe');
		return [{}, [{ error: 'Failed to add recipe' }]];
	}
};

export const editRecipe = async (
	recipeId: string,
	recipe: Recipe
): Promise<[object, Array<CustomError>]> => {
	try {
		await syncService.updateRecipe(recipe);
		notificationData.update(() => 'Recipe has been updated');
		return [recipe, []];
	} catch {
		notificationData.update(() => 'Failed to update recipe');
		return [{}, [{ error: 'Failed to update recipe' }]];
	}
};

export const deleteRecipe = async (
	recipeId: string
): Promise<[object, Array<CustomError>]> => {
	try {
		await syncService.deleteRecipe(recipeId);
		notificationData.update(() => 'Recipe has been deleted');
		return [{}, []];
	} catch {
		notificationData.update(() => 'Failed to delete recipe');
		return [{}, [{ error: 'Failed to delete recipe' }]];
	}
};

export const browserGet = (key: string) => {
	if (browser) {
		const item = localStorage.getItem(key);
		if (item) {
			return item;
		}
	}
	return undefined;
};

export const browserSet = (key: string, value: string) => {
	if (browser) {
		localStorage.setItem(key, value);
	}
};
