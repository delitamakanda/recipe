import { db, storage } from '$lib/firebase/config';
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	setDoc,
	updateDoc,
	where,
	limit,
	startAfter,
	type DocumentData,
	QueryDocumentSnapshot,
	increment,
	arrayUnion
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getDeviceId } from '$lib/utils/deviceId';
import type { Recipe } from '$lib/interfaces/recipe.interface';
import { variables } from '$lib/utils/constants';

export class FirebaseService {
	private lastVisible: QueryDocumentSnapshot | null = null;
	private pageCache: Map<number, QueryDocumentSnapshot<DocumentData>> = new Map();
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

	async likeRecipe(recipeId: string): Promise<Recipe | undefined> {
		if (!recipeId) {
			throw new Error('RecipeId is required');
		}
		const recipeRef = doc(db, 'recipes', recipeId);
		const deviceId = getDeviceId();

		// if deviceId has already liked the recipe, do nothing
		const recipe = await getDoc(recipeRef);
		if (!recipe.exists()) {
			throw new Error('Recipe not found');
		}
		if (recipe.data().liked_by.includes(deviceId)) {
			return;
		}

		await updateDoc(recipeRef, {
			total_likes: increment(1),
			liked_by: arrayUnion(deviceId)
		});
		const updatedRecipe = await getDoc(recipeRef);
		return {
			...updatedRecipe.data(),
			id: updatedRecipe.id
		} as Recipe;
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

	async getAllRecipes(
		searchTerm?: string,
		page: number = 1,
		pageSize: number = variables.RECIPES_PER_PAGE
	): Promise<{ recipes: Recipe[]; total: number }> {
		// const deviceId = getDeviceId();
		const recipesRef = collection(db, 'recipes');

		let countQuery = query(
			recipesRef,
			//where('user', '==', deviceId),
			orderBy('updated_at', 'desc')
		);
		if (searchTerm) {
			const searchTermLowercase = searchTerm.toLowerCase();
			const endTerm = searchTermLowercase + '\uf8ff';
			countQuery = query(
				recipesRef,
				where('title', '>=', searchTermLowercase), // where('user', '==', deviceId),
				where('title', '<=', endTerm), // where('user', '==', deviceId),
				orderBy('title', 'asc'),
				orderBy('updated_at', 'desc')
			);
		}

		const countSnapshot = await getDocs(countQuery);
		const total = countSnapshot.size;
		let paginatedQuery = query(
			recipesRef,
			orderBy('updated_at', 'desc'),
			limit(pageSize)
		);
		if (searchTerm) {
			const searchTermLowercase = searchTerm.toLowerCase();
			const endTerm = searchTermLowercase + '\uf8ff';
			paginatedQuery = query(
				recipesRef,
				where('title', '>=', searchTermLowercase), // where('user', '==', deviceId),
				where('title', '<=', endTerm), // where('user', '==', deviceId),
				orderBy('title', 'asc'),
				orderBy('updated_at', 'desc'),
				limit(pageSize)
			);
		}
		if (page > 1 && this.lastVisible) {
			paginatedQuery = query(paginatedQuery, startAfter(this.lastVisible));
		}
		const querySnapshot = await getDocs(paginatedQuery);
		if (querySnapshot.docs.length > 0) {
			this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
			this.pageCache.set(page, this.lastVisible);
		}
		const recipes = querySnapshot.docs.map(
			(doc) =>
				({
					...doc.data(),
					id: doc.id
				}) as Recipe
		);

		return { recipes, total };
	}

	async resetPagination(): Promise<void> {
		this.lastVisible = null;
		this.pageCache.clear();
	}

	async uploadImage(file: File): Promise<string> {
		const deviceId = getDeviceId();
		const storageRef = ref(storage, `images/${deviceId}/${file.name}`);
		await uploadBytes(storageRef, file);
		return getDownloadURL(storageRef);
	}
}

export const firebaseService = new FirebaseService();
