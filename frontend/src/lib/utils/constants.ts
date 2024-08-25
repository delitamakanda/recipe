import type { Variables } from "$lib/interfaces/variables.interface";

const BASE_API_URL: string = import.meta.env.DEV ? import.meta.env.VITE_BASE_API_URI_DEV : import.meta.env.VITE_BASE_API_URI_PROD;
const RECIPES_PER_PAGE: number = 10;

export const variables: Variables = {
    BASE_API_URL: BASE_API_URL,
    RECIPES_PER_PAGE: RECIPES_PER_PAGE,
}
