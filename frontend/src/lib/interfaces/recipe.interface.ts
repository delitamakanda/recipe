export interface Recipe {
	id?: string;
	user: string;
	title: string;
	image_url: string;
	average_rating: number;
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
	total_likes: number;
	liked_by: Array<string>;
}
