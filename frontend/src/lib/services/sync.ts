import { db } from './db';
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
	private isBrowser = typeof window !== 'undefined';

	constructor() {
		if (this.isBrowser) {
			this.loadSyncQueue();
			this.isOnline = navigator.onLine;
			if (this.isOnline) {
				setTimeout(() => this.processSyncQueue(), 0);
			}
			window.addEventListener('online', () => {
				this.isOnline = true;
				this.processSyncQueue();
			});
			window.addEventListener('offline', () => {
				this.isOnline = false;
			});
		}
	}

	private async loadSyncQueue() {
		if (!this.isBrowser) return;
		try {
			this.syncQueue = await db.syncQueue.toArray();
		} catch (error) {
			console.error('Failed to load sync queue', error);
		}
	}

	private async saveSyncQueue() {
		if (!this.isBrowser) return;
		try {
			await db.syncQueue.clear();
			if (this.syncQueue.length > 0) {
				await db.syncQueue.bulkAdd(this.syncQueue);
			}
		} catch (error) {
			console.error('Failed to save sync queue', error);
		}
	}

	async addToSyncQueue(action: string, data: Recipe | string) {
		if (!this.isBrowser) return;
		const queueItem: SyncQueueItem = {
			id: crypto.randomUUID(),
			action,
			data,
			timestamp: Date.now()
		};
		this.syncQueue.push(queueItem);
		await this.saveSyncQueue();

		if (this.isOnline) {
			await this.processSyncQueue();
		}
	}

	async processSyncQueue() {
		if (!this.isOnline || this.isSyncing || this.syncQueue.length === 0) {
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
			await this.saveSyncQueue();
		} finally {
			this.isSyncing = false;
		}
	}

	async addRecipe(recipe: Recipe): Promise<string> {
		if (!this.isBrowser) return '';
		const recipeId = recipe.id || (await db.recipes.add(recipe));
		const now = new Date().toISOString();
		const recipeWithId = { ...recipe, id: recipeId, created_at: now, updated_at: now };
		await db.recipes.put(recipeWithId);
		if (this.isOnline) {
			try {
				await firebaseService.addRecipe(recipeWithId);
			} catch {
				await this.addToSyncQueue('add', recipeWithId);
			}
		} else {
			await this.addToSyncQueue('add', recipeWithId);
		}
		return recipeId;
	}

	async updateRecipe(recipe: Recipe): Promise<void> {
		await db.recipes.update(recipe.id!, { ...recipe });
		if (this.isOnline) {
			try {
				await firebaseService.updateRecipe(recipe.id!, recipe);
			} catch {
				await this.addToSyncQueue('update', recipe);
			}
		} else {
			await this.addToSyncQueue('update', recipe);
		}
	}

	async deleteRecipe(id: string): Promise<void> {
		await db.recipes.delete(id);
		if (this.isOnline) {
			try {
				await firebaseService.deleteRecipe(id);
			} catch {
				await this.addToSyncQueue('delete', id);
			}
		} else {
			await this.addToSyncQueue('delete', id);
		}
	}

	async getRecipe(id: string): Promise<Recipe | undefined> {
		const recipe = await db.recipes.get(id);
		if (recipe) {
			return recipe;
		}
		if (this.isOnline) {
			try {
				return await firebaseService.getRecipe(id);
			} catch {
				return undefined;
			}
		}
		return undefined;
	}

	async getRecipes(searchTerm?: string): Promise<Recipe[]> {
		const localRecipes = await db.recipes.toArray();
		if (this.isOnline) {
			try {
				const remoteRecipes = await firebaseService.getAllRecipes(searchTerm);
				const recipesMap = new Map(remoteRecipes.map((recipe) => [recipe.id, recipe]));
				const mergedRecipes = localRecipes.map(
					(recipe) => recipesMap.get(recipe.id) || recipe
				);
				remoteRecipes.forEach((recipe) => {
					if (!localRecipes.find((localRecipe) => localRecipe.id === recipe.id)) {
						mergedRecipes.push(recipe);
					}
				});
				if (searchTerm) {
					return mergedRecipes.filter((recipe) =>
						recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
					);
				}
				// sort by updated_at in descending order
				return mergedRecipes.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
			} catch (error) {
				console.error('Failed to fetch recipes from Firebase', error);
			}
		}
		if (searchTerm) {
			return localRecipes.filter((recipe) =>
				recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}
		return localRecipes;
	}

	async uploadImage(imageUrl: File): Promise<string> {
		if (!this.isBrowser) return '';
		try {
			if (this.isOnline) {
				try {
					return await firebaseService.uploadImage(imageUrl);
				} catch {
					throw new Error('Failed to upload image to Firebase');
				}
			} else {
				return new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = (event) => {
						resolve(event.target?.result as string);
					};
					reader.onerror = (error) => {
						reject(error);
					};
					reader.readAsDataURL(imageUrl);
				});
			}
		} catch (error) {
			throw new Error('Failed to upload image');
		}
	}
}

export const syncService = new SyncService();
