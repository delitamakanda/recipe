import type { CustomError } from '$lib/interfaces/error.interface';
import { notificationData } from '$lib/store/notification';
import type { Recipe } from '$lib/interfaces/recipe.interface';
import { syncService } from '$lib/services/sync';
import type { User } from '$lib/interfaces/user.interface';
import { browser } from '$app/environment';
import { firebaseService } from '$lib/services/firebase';
import { userData } from '$lib/store/auth';
import { auth, db } from '$lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const logoutUser = async () => {
	try {
		await firebaseService.logout();
		userData.set(null);
		browserSet('isAuthenticated', 'false');
		return [{ success: true }];
	} catch (error) {
		notificationData.update(() => 'Failed to log out');
		return [
			null,
			[{ message: error instanceof Error ? error.message : 'Failed to log out' }]
		];
	}
};

export const getUser = async (): Promise<[Partial<User> | null, Array<CustomError>]> => {
	const errors: Array<CustomError> = [];
	try {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			return [null, [{ message: 'User not authenticated' }]];
		}
		const userDoRef = doc(db, 'users', currentUser.uid);
		const userDoc = await getDoc(userDoRef);
		if (!userDoc.exists()) {
			return [null, [{ message: 'User not found' }]];
		}
		return [
			{
				...userData,
				id: currentUser.uid,
				email: currentUser.email as string,
				username: currentUser.displayName || '',
				last_login: new Date()
			},
			[]
		];
	} catch (error) {
		errors.push({
			message: error instanceof Error ? error.message : 'Failed to fetch user'
		});
		return [null, errors];
	}
};

export const setupAuthListener = (callback: (user: User | null) => void) => {
	return onAuthStateChanged(auth, async (firebaseUser) => {
		if (firebaseUser) {
			// User is signed in
			browserSet('isAuthenticated', 'true');

			// Get additional user data from Firestore
			try {
				const userDocRef = doc(db, 'users', firebaseUser.uid);
				const userDoc = await getDoc(userDocRef);

				if (userDoc.exists()) {
					const userData = userDoc.data() as User;
					callback({
						...userData,
						id: firebaseUser.uid,
						email: firebaseUser.email || userData.email,
						username: firebaseUser.displayName || userData.username,
						last_login: new Date()
					});
				} else {
					callback(null);
				}
			} catch (error) {
				console.error('Error fetching user data:', error);
				callback(null);
			}
		} else {
			// User is signed out
			browserSet('isAuthenticated', 'false');
			callback(null);
		}
	});
};

export const fetchRecipes = async (
	searchTerm: string = ''
): Promise<[Array<Recipe>, Array<CustomError>]> => {
	try {
		const recipes = await syncService.getRecipes(searchTerm, {
			is_published: true,
			is_active: true
		});
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
