<script lang="ts">
	import { onMount } from 'svelte';

	let name: string = '';
	let email: string = '';
	let message: string = '';
	let errors: Record<string, string> = {};

	function validateForm(): boolean {
		errors = {};

		if (!name) {
			errors.name = 'Name is required';
		} else if (!/^[a-zA-Z]+$/.test(name)) {
			errors.name = 'Name should only contain letters';
		}

		if (!email) {
			errors.email = 'Email is required';
			return false;
		}
		if (!/^\S+@\S+\.\S+$/.test(email)) {
			errors.email = 'Invalid email format';
			return false;
		}
		if (!message) {
			errors.message = 'Message is required';
			return false;
		}

		return true;
	}

	function resetForm(): void {
		name = '';
		email = '';
		message = '';
		errors = {};
	}

	function submitForm(event: Event): void {
		event.preventDefault();
		if (!validateForm()) return;

		// Simulate form submission
		console.log('Form submitted:', { name, email, message });
		resetForm();
	}

	onMount(() => {
		resetForm();
	});
</script>

<div class="container mx-auto px-4 py-8 max-w-3xl">
	<h1 class="text-3xl font-bold mb-6">Contact Us</h1>

	<div class="bg-white p-6 mb-8 rounded-lg shadow-md">
		<div class="mb-4">
			<h2 class="text-lg font-medium mb-2">Get in Touch</h2>
			<p class="text-gray-700">
				Feel free to reach out if you have any questions or need assistance.
			</p>
			<div class="flex flex-wrap items-center mb-3">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-primary mr-2"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
				</svg>
				<span class="text-gray-700">contact@recipeapp.example.com</span>
			</div>
		</div>
		<form on:submit={submitForm}>
			<div class="mb-4">
				<label for="name" class="block text-sm font-medium text-gray-700 mb-1"
					>Name</label>
				<input
					id="name"
					type="text"
					class="block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline" />
				<div class="text-sm text-red-500">
					{#if errors.name}
						{errors.name}
					{/if}
				</div>
			</div>
			<div class="mb-4">
				<label for="email" class="block text-sm font-medium text-gray-700 mb-1"
					>Email</label>
				<input
					id="email"
					type="email"
					class="block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline" />
				<div class="text-sm text-red-500">
					{#if errors.email}
						{errors.email}
					{/if}
				</div>
			</div>
			<div class="mb-4">
				<label for="message" class="block text-sm font-medium text-gray-700 mb-1"
					>Message</label>
				<textarea
					id="message"
					class="block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline"
					rows="5"></textarea>
				<div class="text-sm text-red-500">
					{#if errors.message}
						{errors.message}
					{/if}
				</div>
			</div>
			<div class="flex justify-end">
				<button
					type="submit"
					class="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-primary hover:bg">
					Submit
					<svg class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7" />
					</svg>
				</button>
			</div>
		</form>
	</div>

	<div class="bg-white p-6 mb-8 rounded-lg shadow-md">
		<h2 class="text-lg font-medium mb-2">Frequently Asked Questions</h2>
		<div class="space-y-4">
			<div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
				<input type="checkbox" />
				<div class="collapse-title text-lg font-medium">
					How do I save my favorite recipes?
				</div>
				<div class="collapse-content">
					<p>
						You can save your favorite recipes by clicking the heart icon on any recipe
						page. Your saved recipes will appear in your "Favorites" collection.
					</p>
				</div>
			</div>
			<div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
				<input type="checkbox" />
				<div class="collapse-title text-lg font-medium">Can I share my own recipes?</div>
				<div class="collapse-content">
					<p>
						Yes! You can create and share your own recipes by using the "Add Recipe"
						feature in top bar.
					</p>
				</div>
			</div>

			<div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
				<input type="checkbox" />
				<div class="collapse-title text-lg font-medium">
					Is there a mobile app available?
				</div>
				<div class="collapse-content">
					<p>
						We're currently working on mobile apps for iOS and Android. Stay tuned for
						updates!
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
