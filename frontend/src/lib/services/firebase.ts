import { db, storage } from '$lib/firebase/config';
import {
	collection,
	doc,
	setDoc,
	getDoc,
	getDocs,
	updateDoc,
	deleteDoc,
	query,
	where,
	orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDeviceId } from '$lib/utils/deviceId';
import type { Recipe } from '$lib/interfaces/recipe.interface';

export class FirebaseService {
	async addRecipe(recipe: Recipe): Promise<string> {
		const deviceId = getDeviceId();
		const recipeId = recipe.id || crypto.randomUUID();
		const now = new Date().toISOString();
		const recipeData = { ...recipe, user: deviceId, created_at: now, updated_at: now };

		await setDoc(doc(db, 'recipes', recipeId), recipeData);
		return recipeId;
	}

	async getRecipe(recipeId: string): Promise<Recipe | undefined> {
		const docRef = doc(db, 'recipes', recipeId);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) {
			return undefined;
		} else {
			return { ...docSnap.data(), id: docSnap.id } as Recipe;
		}
	}

	async updateRecipe(recipeId: string, updatedRecipe: Recipe): Promise<void> {
		if (!recipeId) {
			throw new Error('Recipe ID is required');
		}
		const recipeRef = doc(db, 'recipes', recipeId);
		await updateDoc(recipeRef, {
			...updatedRecipe,
			updated_at: new Date().toISOString()
		});
	}

	async deleteRecipe(recipeId: string): Promise<void> {
		await deleteDoc(doc(db, 'recipes', recipeId));
	}

	async getAllRecipes(searchTerm?: string): Promise<Recipe[]> {
		const deviceId = getDeviceId();
		const recipesRef = collection(db, 'recipes');

		let q = query(
			recipesRef,
			where('user', '==', deviceId),
			orderBy('updated_at', 'desc')
		);
		if (searchTerm) {
			q = query(q, where('title', '==', searchTerm));
		}
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Recipe);
	}

	async uploadImage(file: File): Promise<string> {
		const deviceId = getDeviceId();
		const storageRef = ref(storage, `images/${deviceId}/${file.name}`);
		await uploadBytes(storageRef, file);
		return getDownloadURL(storageRef);
	}
}

export const firebaseService = new FirebaseService();
