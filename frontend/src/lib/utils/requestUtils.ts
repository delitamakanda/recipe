import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { notificationData } from "$lib/store/notification";
import { userData } from "$lib/store/user";

import { variables } from "$lib/utils/constants";
import { formatCurrency, formatDate, formatText } from "$lib/helpers/formatters";


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

export const post = async (fetch: any, url: string, body: unknown) => {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": ""
        }
        if (!(body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
            body = JSON.stringify(body);
            const token = browserGet("refreshToken");
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: body
            });
            const data = await response.json();
            if (response.errors) {
                const errors = [];
                for (const p in response.errors) {
                    errors.push({ error: response.errors[p] });
                }
                return [{}, errors];
            }
            return [data, []];
        }
    } catch (error) {
        const errors = [{ error: 'An error occurred' }, { error: `${error}` }];
        return [{}, errors];
    }
}

export const getUser = async(
    fetch: any,
    refreshUrl: string,
    useUrl: string
) => {
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
    const data = await response.json();
    if (data.access) {
        const res = await fetch(useUrl, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${data.access}`
            }
        });
        if (res.status === 400) {
            const error = await res.json()['user']['error'][0];
            return [{}, [error]];
        }
        return [await res.json()['user'], []];
    } else {
        return [{}, [{ error: 'Refresh token is invalid' }]];
    }
}

export const logoutUser = async() => {
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

export const handlePostRequestsWithPermissions = async(
    fetch: any,
    targetUrl: string,
    body: unknown,
    method = 'POST'
) => {
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
        if (jres.status!== 201) {
            const data = await jres.json()
            console.error('Data:' + data);
            const error = data.errors;
            console.error(error);
            return [{}, [error]];
        }
        return [await jres.json(), []];
    }
}

export const updateField = async(fieldName: string, fieldValue: string, url: string) => {
    const userObj = { user: {} };
    let formData = {} as any;
    if (url.includes('/user')) {
        formData = userObj as any;
        formData['user'][`${fieldName}`] = fieldValue;
    } else {
        formData[`${fieldName}`] = fieldValue;
    }
    const [response, err]: any = await handlePostRequestsWithPermissions(fetch, url, formData, 'PATCH');
    if (err.length > 0) {
        return [{}, err];
    }
    notificationData.update(() => `${formatText(fieldName)} has been updated`);
    return [response, []];
}
