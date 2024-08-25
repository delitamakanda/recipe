import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import type { Token, User, UserResponse } from "$lib/interfaces/user.interface";
import type { CustomError } from "$lib/interfaces/error.interface";
import { notificationData } from "$lib/store/notification";
import { userData } from "$lib/store/user";
import { recipeData, recipeListData } from "$lib/store/recipe";
import type { Recipe } from "$lib/interfaces/recipe.interface";
import { variables } from "$lib/utils/constants";
import { formatText } from "$lib/helpers/formatters";


export const browserGet = (key: string) => {
    if (browser) {
        const item = localStorage.getItem(key);
        if (item) {
            return item;
        }
    }
    return undefined;
}

export const browserSet = (key: string, value: string) => {
    if (browser) {
        localStorage.setItem(key, value);
    }
}

export const put = async (
    fetch: any, url: string, body: unknown
): Promise<[object, Array<CustomError>] | any> => {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": ""
        }
        const token = browserGet("refreshToken");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(body),
            headers,
        });
        const response = await res.json();
        if (response.user.error) {
            const errors: Array<CustomError> = [];
            for (const p in response.user.error) {
                errors.push({ error: response.user.error[p] });
            }
            return [{}, errors];
        } else if (res.status === 400) {
            const errors: Array<CustomError> = [];
            for (const p in response.user) {
                errors.push({ error: response.user[p] });
            }
        }
        return [response, []];
    } catch (error) {
        return [{ error: error }, []];
    }

}

export const post = async (
    fetch: any, url: string, body: unknown
): Promise<[object, Array<CustomError>] | any> => {
    try {
        const headers = {
            "Content-Type": "application",
            "Authorization": ""
        }
        if (!(body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
            body = JSON.stringify(body);
            const token = browserGet("refreshToken");
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
            const res = await fetch(url, {
                method: "POST",
                body,
                headers,
            });
            const response = await res.json();
            if (response.user.error) {
                const errors: Array<CustomError> = [];
                for (const p in response.user.error) {
                    errors.push({ error: response.user.error[p] });
                }
                return [{}, errors];
            } else if (res.status === 400) {
                const errors: Array<CustomError> = [];
                for (const p in response.user) {
                    errors.push({ error: response.user[p] });
                }
                return [{}, errors];
            }
            return [response, []];
        }
    } catch (error) {
        const errors: Array<CustomError> = [{ error: 'An error occurred' }, { error: `${error}` }];
        return [{}, errors];
    }
}

export const getUser = async (
    fetch: any,
    refreshUrl: string,
    useUrl: string
): Promise<[object, Array<CustomError>]> => {
    const response = await fetch(refreshUrl, {
        method: "POST",
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refresh: browserGet("refreshToken")
        })
    });
    const data: Token = await response.json();
    if (data.access) {
        const res = await fetch(useUrl, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${data.access}`
            }
        });
        if (res.status === 400) {
            const jsonRes = await res.json();
            const error = await jsonRes.user.error[0];
            return [{}, error];
        }
        const responseJson = await res.json();
        return [responseJson.user, []];
    } else {
        return [{}, [{ error: 'Refresh token is invalid' }]];
    }
}

export const logoutUser = async (): Promise<void> => {
    const res = await fetch(`${variables.BASE_API_URL}/token/refresh/`, {
        method: "POST",
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refresh: browserGet("refreshToken")
        })
    });
    const accessRefresh = await res.json();
    const jres = await fetch(`${variables.BASE_API_URL}/logout/`, {
        method: "POST",
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessRefresh.access}`
        },
        body: JSON.stringify({
            refresh: `${browserGet("refreshToken")}`
        })
    });
    if (jres.status !== 204) {
        const data = await jres.json();
        const error = data.user.error[0];
        throw { id: error.id, message: error }
    }
    localStorage.removeItem("refreshToken");
    userData.set({});
    notificationData.update(() => 'You have been logged out');
    await goto('/accounts/login');
}

export const handlePostRequestsWithPermissions = async (
    fetch: any,
    targetUrl: string,
    body: unknown,
    method = 'POST'
): Promise<[object, Array<CustomError>] | any> => {
    const res = await fetch(`${variables.BASE_API_URL}/token/refresh/`, {
        method: "POST",
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refresh: browserGet("refreshToken")
        })
    })
    const accessRefresh = await res.json();
    const jres = await fetch(targetUrl, {
        method: method,
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessRefresh.access}`
        },
        body: JSON.stringify(body)
    })
    if (method === 'PATCH') {
        if (jres.status !== 200) {
            const data = await jres.json()
            console.error('Data:' + data);
            const error = data.errors;
            console.error(error);
            return [{}, [error]];
        }
        return [await jres.json(), []];
    } else if (method === 'POST') {
        if (jres.status !== 201) {
            const data = await jres.json()
            console.error('Data:' + data);
            const error = data.errors;
            console.error(error);
            return [{}, [error]];
        }
        return [await jres.json(), []];
    }
}

export const updateField = async (fieldName: string, fieldValue: string, url: string): Promise<[object, Array<CustomError>]> => {
    const userObj: UserResponse = { user: {} as User };
    let formData: UserResponse | any;
    if (url.includes('/user/')) {
        formData = userObj;
        formData['user'][`${fieldName}`] = fieldValue;
    } else {
        formData[`${fieldName}`] = fieldValue;
    }
    const [response, err] = await handlePostRequestsWithPermissions(fetch, url, formData, 'PATCH');
    if (err.length > 0) {
        return [{}, err];
    }
    notificationData.update(() => `${formatText(fieldName)} has been updated`);
    return [response, []];
}

export const fetchRecipes = async (searchTerm: string = ''): Promise<[Array<Recipe>, Array<CustomError>]> => {
    const response = await fetch(`${variables.BASE_API_URL}/recipes/?q=${searchTerm}&ordering=-created_at&is_published=True&is_deleted=False`);
    const data = await response.json();
    if (!response.ok) {
        recipeListData.set([]);
        notificationData.update(() => 'No recipes found');
        return [[], data.errors];
    }
    return [data.results, []];
}

export const fetchRecipe = async (recipeId: string): Promise<[object, Array<CustomError>]> => {
    const response = await fetch(`${variables.BASE_API_URL}/recipes/${recipeId}`);
    const data = await response.json();
    if (!response.ok) {
        recipeData.set({} as Recipe);
        notificationData.update(() => 'Recipe not found');
    }
    recipeData.set(data);
    return data;
}

export const addRecipe = async (recipe: Recipe): Promise<[object, Array<CustomError>]> => {
    const response = await post(fetch, `${variables.BASE_API_URL}/recipes/`, recipe);
    const [data, errors] = response;
    if (errors.length > 0) {
        notificationData.update(() => 'Failed to add recipe');
        return errors[0].error;
    }
    notificationData.update(() => 'Recipe has been added');
    return data;
}
