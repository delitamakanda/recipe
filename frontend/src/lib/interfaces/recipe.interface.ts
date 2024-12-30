export interface Recipe {
	id?: string;
	user: number;
	title: string;
	preparation_time: number;
	cooking_time: number;
	servings: number;
	ingredients: string;
	instructions: string;
	created_at: string;
	updated_at: string;
	is_active: boolean;
	is_private: boolean;
	is_deleted: boolean;
	is_published: boolean;
	is_shared: boolean;
	rating: number;
	likes: number;
}
