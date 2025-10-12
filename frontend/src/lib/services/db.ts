import type { Recipe } from '$lib/interfaces/recipe.interface';
import type { User } from '$lib/interfaces/user.interface';

import Dexie from 'dexie';

let db: RecipeDatabase;

export class RecipeDatabase extends Dexie {
	recipes: Dexie.Table<Recipe>;
	users: Dexie.Table<User>;
	syncQueue: Dexie.Table<{
		id: string;
		action: string;
		data: Recipe | string;
		timestamp: number;
	}>;

	constructor() {
		super('recipe');
		this.version(1).stores({
			recipes:
				'id, user, title, image_url, average_rating, preparation_time, cooking_time, servings, ingredients, instructions, created_at, updated_at, is_active, is_private, is_deleted, is_published, is_shared, rating, total_likes, liked_by',
			users:
				'id, username, email, password, first_name, last_name, is_staff, is_superuser, date_joined, last_login, tokens',
			syncQueue: 'id, action, timestamp'
		});
		this.recipes = this.table('recipes');
		this.users = this.table('users');
		this.syncQueue = this.table('syncQueue');
	}
}

if (typeof window !== 'undefined') {
	db = new RecipeDatabase();
}

export { db };
