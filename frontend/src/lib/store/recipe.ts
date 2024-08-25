import type { Recipe } from "$lib/interfaces/recipe.interface";
import { writable } from "svelte/store";

export const recipeListData = writable<Array<Recipe>>([]);

export const updatedRecipeList = (newList: Array<Recipe>) => {
    recipeListData.update((currentList) => [...currentList, ...newList] as Array<Recipe>);
};

export const recipeData = writable<Recipe>({} as Recipe);

export const recipeSearchTerm = writable<string>("");


