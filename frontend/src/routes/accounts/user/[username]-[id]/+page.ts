import { variables } from '$lib/utils/constants';
import type { PageLoad } from './$types';
import { getUser } from '$lib/utils/requestUtils';
import type { User } from '$lib/interfaces/user.interface';

export const load: PageLoad = async ({ fetch }) => {
	const [userRes, err] = await getUser(
		fetch,
		`${variables.BASE_API_URL}/token/refresh/`,
		`${variables.BASE_API_URL}/user/`
	);

	const userResponse: User | undefined = userRes as User | undefined;

	if (err.length > 0 && !userResponse?.id) {
		return {
			redirect: '/accounts/login',
			status: 302
		};
	}

	return {
		userResponse
	};
};
