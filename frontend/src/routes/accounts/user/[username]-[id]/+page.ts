import { redirect } from "@sveltejs/kit";
import { variables } from "$lib/utils/constants";
import { getUser } from "$lib/utils/requestUtils";
import type { User } from "$lib/interfaces/user.interface.js";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const [userResponse, err] = await getUser(fetch,
        `${variables.BASE_API_URL}/token/refresh/`,
        `${variables.BASE_API_URL}/user/`,
    );

    const response: User = userResponse as User;

    if (err.length > 0 && !response.id) {
        throw redirect(302, '/accounts/login');
    }

    return { response }
}