import { db, auth, storage } from '$lib/firebase/config';
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
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
	sendPasswordResetEmail,
	type User as FirebaseUser
} from 'firebase/auth';
import type { Recipe } from '$lib/interfaces/recipe.interface';

export class FirebaseService {
	async register(
		email: string,
		password: string,
		username: string
	): Promise<FirebaseUser | null> {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		await updateProfile(userCredential.user, { displayName: username });

		await setDoc(doc(db, 'users', userCredential.user.uid), {
			id: userCredential.user.uid,
			username,
			email,
			password,
			first_name: '',
			last_name: '',
			is_staff: false,
			is_superuser: false,
			date_joined: new Date().toISOString(),
			last_login: new Date().toISOString(),
			tokens: {
				access: '',
				refresh: ''
			}
		});
		return userCredential.user;
	}

	async login(email: string, password: string): Promise<FirebaseUser | null> {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		return userCredential.user;
	}

	async logout(): Promise<void> {
		await signOut(auth);
	}

	async resetPassword(email: string): Promise<void> {
		await sendPasswordResetEmail(auth, email);
	}

	async addRecipe(recipe: Recipe): Promise<string> {
		const user = auth.currentUser;
		if (!user) {
			throw new Error('User not authenticated');
		}
		const recipeId = recipe.id || crypto.randomUUID();
		const now = new Date().toISOString();
		const recipeData = { ...recipe, user: user.uid, created_at: now, updated_at: now };

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

	async getAllRecipes(
		searchTerm: string = '',
		filters: Record<string, boolean> = {}
	): Promise<Recipe[]> {
		let q = collection(db, 'recipes');
		const constraints = [];
		if (filters.is_published) {
			constraints.push(where('is_published', '==', true));
		}
		if (filters.is_active) {
			constraints.push(where('is_active', '==', true));
		}
		if (filters.user) {
			constraints.push(where('user', '==', filters.user));
		}
		constraints.push(orderBy('created_at', 'desc'));
		q = query(q, ...constraints);
		const querySnapshot = await getDocs(q);
		let recipes = querySnapshot.docs.map((doc) => doc.data() as Recipe);
		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			recipes = recipes.filter(
				(recipe) =>
					recipe.title.toLowerCase().includes(term) ||
					recipe.ingredients.toLowerCase().includes(term) ||
					recipe.instructions.toLowerCase().includes(term)
			);
		}
		return recipes;
	}

	async uploadImage(file: File): Promise<string> {
		const user = auth.currentUser;
		if (!user) {
			throw new Error('User not authenticated');
		}
		const storageRef = ref(storage, `images/${user.uid}/${file.name}`);
		await uploadBytes(storageRef, file);
		return getDownloadURL(storageRef);
	}
}

export const firebaseService = new FirebaseService();
