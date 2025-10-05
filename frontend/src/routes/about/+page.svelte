<script lang="ts">
	import { variables } from '$lib/utils/constants';
	const { recipeAppUrl } = variables;

	export const meta = {
		title: 'About Recipe App',
		description:
			'Recipe App is a personal recipe management solution that helps food enthusiasts organize, discover, and share their favorite recipes.',
		og: {
			url: `${recipeAppUrl}/about`,
			title: 'About Recipe App'
		}
	};
</script>

<div class="container mx-auto px-4 py-8 max-w-3xl">
	<h1 class="text-3xl font-bold mb-6">About Recipe App</h1>

	<div class="bg-white rounded-lg p-6 mb-8 shadow-md">
		<h2 class="text-lg font-semibold mb-4">Our Mission</h2>
		<p class="mb-4">
			Welcome to Recipe App, your personal recipe management solution. We created this
			platform with a simple goal: to help food enthusiasts organize, discover, and share
			their favorite recipes.
		</p>
		<p class="mb-4">
			Whether you're a professional chef or a home cook, our app provides the tools you
			need to store your culinary creations, find inspiration, and keep your cooking
			organized.
		</p>
		<p>
			Started in 2023, Recipe App has grown from a simple idea to a comprehensive recipe
			management system that puts the joy of cooking at your fingertips.
		</p>
	</div>
	<div class="bg-white rounded-lg shadow-md p-6 mb-8">
		<h2 class="text-xl font-semibold mb-4">Features</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="border-l-4 border-primary pl-4">
				<h3 class="font-medium text-lg">Recipe Storage</h3>
				<p class="text-gray-600">
					Save all your recipes in one secure place, accessible from anywhere.
				</p>
			</div>
			<div class="border-l-4 border-primary pl-4">
				<h3 class="font-medium text-lg">Search & Filter</h3>
				<p class="text-gray-600">
					Quickly find recipes by ingredients, cooking time, or meal type.
				</p>
			</div>
			<div class="border-l-4 border-primary pl-4">
				<h3 class="font-medium text-lg">Sharing Options</h3>
				<p class="text-gray-600">Share your favorite recipes with friends and family.</p>
			</div>
		</div>
	</div>

	<div class="bg-white rounded-lg shadow-md p-6 mb-8">
		<h2 class="text-xl font-semibold mb-4">Our Team</h2>
		<div class="flex flex-col md:flex-row gap-6">
			<div class="flex-1 text-center">
				<div class="avatar placeholder mb-4">
					<div class="bg-neutral-focus text-neutral-content rounded-full w-24 mx-auto">
						<span class="text-3xl">DM</span>
					</div>
				</div>
				<h3 class="font-medium text-lg">Délita Makanda</h3>
				<p class="text-gray-600">Founder & Developer</p>
			</div>
			<div class="flex-1 text-center">
				<div class="avatar placeholder mb-4">
					<div class="bg-neutral-focus text-neutral-content rounded-full w-24 mx-auto">
						<span class="text-3xl">CT</span>
					</div>
				</div>
				<h3 class="font-medium text-lg">Culinary Team</h3>
				<p class="text-gray-600">Recipe Curators</p>
			</div>
			<div class="flex-1 text-center">
				<div class="avatar placeholder mb-4">
					<div class="bg-neutral-focus text-neutral-content rounded-full w-24 mx-auto">
						<span class="text-3xl">CD</span>
					</div>
				</div>
				<h3 class="font-medium text-lg">Community</h3>
				<p class="text-gray-600">Recipe Contributors</p>
			</div>
		</div>
	</div>

	<div class="bg-white rounded-lg shadow-md p-6">
		<h2 class="text-xl font-semibold mb-4">Technology</h2>
		<p class="mb-4">
			Recipe App is built using modern web technologies to provide a fast, reliable, and
			user-friendly experience:
		</p>
		<ul class="list-disc pl-5 space-y-2 mb-4">
			<li>Frontend: SvelteKit with TypeScript for a responsive and interactive UI</li>
			<li>Styling: Tailwind CSS with DaisyUI components</li>
			<li>Data Storage: Firebase for secure cloud storage of your recipes</li>
			<li>Offline Support: Local storage for access even without internet</li>
		</ul>
		<p>
			We're constantly improving our platform and adding new features to enhance your
			recipe management experience.
		</p>
	</div>

	<div class="mt-8 text-center">
		<p class="text-gray-600">
			Have questions or suggestions? Visit our <a
				href="/contact"
				class="text-primary hover:underline">Contact page</a
			>.
		</p>
	</div>
</div>
