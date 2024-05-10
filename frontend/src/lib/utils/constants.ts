const BASE_API_URL = import.meta.env.DEV ? import.meta.env.VITE_BASE_API_URI_DEV : import.meta.env.VITE_BASE_API_URI_PROD;

export const variables = {
    BASE_API_URL: BASE_API_URL,
}
