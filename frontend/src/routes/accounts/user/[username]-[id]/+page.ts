import type { PageLoad } from './$types';
import { getUser } from '$lib/utils/requestUtils';
import type { User } from '$lib/interfaces/user.interface';
import { browser } from '$app/environment';

export const load: PageLoad = async () => {
	if (!browser) {
		return {
			userResponse: null
		};
	}

	const [userRes, err] = await getUser();

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
