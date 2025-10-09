import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params: { slug } }) => {
	const response = await fetch(`/pages/${slug}.txt`);

	if (!response.ok) {
		throw new Error(`Failed to fetch legal text for slug "${slug}": ${response.status}`);
	}

	const legalText = await response.text();

	return {
		legalText,
		slug
	};
};
