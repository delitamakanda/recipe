export interface Recipe {
    id: string;
    title: string;
    preparation_time: string;
    cooking_time: string;
    servings: number;
    ingredients: string;
    instructions: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    is_deleted: boolean;
    is_published: boolean;
    is_shared: boolean;
    rating: number;
    likes: number;
}
