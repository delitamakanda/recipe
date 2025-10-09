import type { PageLoad } from './$types';
import { browser } from '$app/environment';

export const load: PageLoad = async ({ params: { slug }, fetch, depends }) => {
	depends(`pages:${slug}`);
	const timestamp = browser ? new Date().getTime() : '';
	const response = await fetch(`${slug}.txt?_=${timestamp}`, {
		cache: 'no-store'
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch legal text for slug "${slug}": ${response.status}`);
	}

	const legalText = await response.text();

	return {
		legalText,
		slug,
		timestamp: new Date().getTime()
	};
};

export const csr = true;
export const ssr = true;
export const trailingSlash = 'never';
