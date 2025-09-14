import { db } from './db';
import { auth } from '$lib/firebase/config';
import type { Recipe } from '$lib/interfaces/recipe.interface';
import { firebaseService } from '$lib/services/firebase';

interface SyncQueueItem {
	id: string;
	action: string;
	data: Recipe | string;
	timestamp: number;
}

export class SyncService {
	private isOnline = true;
	private syncQueue: SyncQueueItem[] = [];
	private isSyncing = false;

	constructor() {
		if (typeof window !== 'undefined') {
			window.addEventListener('online', () => {
				this.isOnline = true;
				this.processSyncQueue();
			});
			window.addEventListener('offline', () => {
				this.isOnline = false;
			});
			this.loadSyncQueue();
		} else {
			this.isOnline = false;
		}
	}

	private loadSyncQueue() {
		if (typeof window === 'undefined') {
			return;
		}
		const savedQueue = localStorage.getItem('syncQueue');
		if (savedQueue) {
			try {
				this.syncQueue = JSON.parse(savedQueue);
			} catch {
				this.syncQueue = [];
			}
		}
	}

	private saveSyncQueue() {
		localStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
	}

	async addToSyncQueue(action: string, data: Recipe | string) {
		const queueItem: SyncQueueItem = {
			id: typeof data === 'string' ? data : data.id || crypto.randomUUID(),
			action,
			data,
			timestamp: Date.now()
		};
		this.syncQueue.push(queueItem);
		this.saveSyncQueue();

		if (this.isOnline && auth.currentUser) {
			await this.processSyncQueue();
		}
	}

	async processSyncQueue() {
		if (
			!this.isOnline ||
			!auth.currentUser ||
			this.isSyncing ||
			this.syncQueue.length === 0
		) {
			return;
		}
		this.isSyncing = true;
		try {
			const processItems: string[] = [];
			for (const item of this.syncQueue) {
				try {
					switch (item.action) {
						case 'add':
							if (typeof item.data !== 'string') {
								await firebaseService.addRecipe(item.data);
							}
							break;
						case 'update':
							if (typeof item.data !== 'string') {
								const recipe = item.data as Recipe;
								await firebaseService.updateRecipe(recipe.id!, recipe);
							}
							break;
						case 'delete':
							// eslint-disable-next-line no-case-declarations
							const id =
								typeof item.data === 'string' ? item.data : (item.data as Recipe).id;
							if (id) {
								await firebaseService.deleteRecipe(id);
							}
							break;
					}
					processItems.push(item.id);
				} catch (error) {
					console.error('Failed to process sync item', error);
				}
			}
			this.syncQueue = this.syncQueue.filter((item) => !processItems.includes(item.id));
			this.saveSyncQueue();
		} finally {
			this.isSyncing = false;
		}
	}

	async addRecipe(recipe: Recipe): Promise<string> {
		const recipeId = await db.recipes.add(recipe);
		if (this.isOnline && auth.currentUser) {
			try {
				await firebaseService.addRecipe({ ...recipe, id: recipeId });
			} catch {
				this.addToSyncQueue('add', { ...recipe, id: recipeId });
			}
		} else {
			this.addToSyncQueue('add', { ...recipe, id: recipeId });
		}
		return recipeId;
	}

	async updateRecipe(recipe: Recipe): Promise<void> {
		await db.recipes.update(recipe.id!, { ...recipe });
		if (this.isOnline && auth.currentUser) {
			try {
				await firebaseService.updateRecipe(recipe.id!, recipe);
			} catch {
				this.addToSyncQueue('update', recipe);
			}
		} else {
			this.addToSyncQueue('update', recipe);
		}
	}

	async deleteRecipe(id: string): Promise<void> {
		await db.recipes.delete(id);
		if (this.isOnline && auth.currentUser) {
			try {
				await firebaseService.deleteRecipe(id);
			} catch {
				this.addToSyncQueue('delete', id);
			}
		} else {
			this.addToSyncQueue('delete', id);
		}
	}

	async getRecipe(id: string): Promise<Recipe | undefined> {
		const recipe = await db.recipes.get(id);
		if (this.isOnline && auth.currentUser) {
			try {
				const firebaseRecipe = await firebaseService.getRecipe(id);
				if (firebaseRecipe) {
					if (recipe) {
						return { ...recipe, ...firebaseRecipe };
					}
					return firebaseRecipe;
				}
			} catch {
				// Handle error
			}
		}
	}

	async getRecipes(
		searchTerm?: string,
		filters?: Record<string, boolean>
	): Promise<Recipe[]> {
		const recipes = await db.recipes.toArray();
		if (this.isOnline && auth.currentUser) {
			try {
				const firebaseRecipes = await firebaseService.getAllRecipes(searchTerm);
				const recipeMap = new Map<string, Recipe>();
				recipes.forEach((recipe) => {
					if (recipe.id) {
						recipeMap.set(recipe.id, recipe);
					}
				});
				firebaseRecipes.forEach((recipe) => {
					if (recipe.id) {
						if (recipeMap.has(recipe.id)) {
							recipeMap.set(recipe.id, { ...recipeMap.get(recipe.id)!, ...recipe });
						} else {
							recipeMap.set(recipe.id, recipe);
						}
					}
				});
				return Array.from(recipeMap.values());
			} catch {
				// Handle error
			}
		}
		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			return recipes.filter(
				(recipe) =>
					recipe.title.toLowerCase().includes(term) ||
					recipe.ingredients.toLowerCase().includes(term) ||
					recipe.instructions.toLowerCase().includes(term)
			);
		}
		if (filters) {
			return recipes.filter((recipe) => {
				for (const key in filters) {
					if (filters[key] && !recipe[key]) {
						return false;
					}
				}
				return true;
			});
		}
		return recipes;
	}
}

export const syncService = new SyncService();
