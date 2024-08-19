import { redirect } from "@sveltejs/kit";
import { variables } from "$lib/utils/constants";
import { getCurrentUser } from "$lib/utils/requestUtils";

export const load = async ({ fetch }) => {
    const [userResponse, err] = await getCurrentUser(fetch,
        `${variables.BASE_API_URL}/auth/token/refresh/}`,
        `${variables.BASE_API_URL}/auth/me/`,
    );

    const response = userResponse as unknown;

    if (err) {
        throw redirect(302, '/accounts/login');
    }

    return { response }
}