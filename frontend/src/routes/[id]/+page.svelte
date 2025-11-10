<script lang="ts">
	import { fly } from 'svelte/transition';
	import { recipeData } from '$lib/store/recipe';
	import { onMount } from 'svelte';
	import { Clock, Users, ChefHat } from 'lucide-svelte';

	export let data;

	onMount(() => {
		if (data.recipeResponse) {
			recipeData.set(data.recipeResponse);
		}
	});

	const parseIngredients = (ingredients: string): string[] => {
		return ingredients.split('\n').filter((item) => item.trim());
	};

	const parseInstructions = (instructions: string): string[] => {
		return instructions.split('\n').filter((item) => item.trim());
	};
</script>

<div class="recipe min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
	{#if $recipeData.id}
		<div
			class="max-w-4xl mx-auto"
			in:fly={{ y: -100, duration: 500, delay: 500 }}
			out:fly={{ duration: 500 }}>
			<div class="relative h-96 overflow-hidden rounded-b-3xl lg">
				{#if $recipeData.image_url}
					<img
						class="w-full h-full object-cover"
						src={$recipeData.image_url}
						alt={$recipeData.title} />
					<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
					</div>
				{:else}
					<div
						class="w-full h-full bg-gradient-to-br from-orange-300 to-amber-400 flex items-center justify-center">
						<ChefHat class="w-24 h-24 text-white opacity-50" />
					</div>
				{/if}

				<!-- Recipe details -->
				<div class="absolute bottom-0 left-0 right-0 p-8">
					<h1 class="text-4xl md:text-5xl font-bold text-white mb-2">
						{$recipeData.title}
					</h1>
					<div class="flex items-center gap-2">
						<div class="flex gap-1">
							{#each Array(5) as _, i}
								<span
									alt={_ + (i + 1)}
									class={`text-lg ${
										i < Math.round($recipeData.average_rating)
											? 'text-yellow-400'
											: 'text-gray-300'
									}`}>
									★
								</span>
							{/each}
						</div>
						<span class="text-white text-sm">({$recipeData.average_rating}/5)</span>
					</div>
				</div>
			</div>

			<!-- info section -->

			<div class="grid grid-cols-3 gap-4 px-8 -mt-8 relative z-10 mb-8">
				<div class="bg-white rounded-2xl shadow-md p-6 text-center">
					<div class="flex justify-center mb-2">
						<Clock class="w-6 h-6 text-orange-500" />
					</div>
					<p class="text-gray-600 text-sm">Préparation</p>
					<p class="text-2xl font-bold text-gray-800">
						{$recipeData.preparation_time} min
					</p>
				</div>

				<div class="bg-white rounded-2xl shadow-md p-6 text-center">
					<div class="flex justify-center mb-2">
						<Clock class="w-6 h-6 text-orange-500" />
					</div>
					<p class="text-gray-600 text-sm">Cuisson</p>
					<p class="text-2xl font-bold text-gray-800">{$recipeData.cooking_time} min</p>
				</div>

				<div class="bg-white rounded-2xl shadow-md p-6 text-center">
					<div class="flex justify-center mb-2">
						<Users class="w-6 h-6 text-orange-500" />
					</div>
					<p class="text-gray-600 text-sm">Portions</p>
					<p class="text-2xl font-bold text-gray-800">{$recipeData.servings}</p>
				</div>
			</div>

			<!-- Main content -->
			<div class="px-8 pb-12">
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<!-- Ingredients -->
					<div class="lg:col-span-1">
						<div class="bg-white rounded-2xl shadow-md p-6 sticky top-8">
							<h2 class="text-2xl font-bold text-gray-800 mb-4">
								<ChefHat class="w-6 h-6 text-orange-500" />Ingredients
							</h2>
							<ul class="space-y-3">
								{#each parseIngredients($recipeData.ingredients) as ingredient}
									<li class="flex items-start gap-3">
										<input
											type="checkbox"
											class="mt-1 w-4 h-4 text-orange-500 rounded cursor-pointer" />
										<span class="text-gray-700">{ingredient}</span>
									</li>
								{/each}
							</ul>
						</div>
					</div>

					<!-- Instructions -->
					<div class="lg:col-span-2">
						<div class="bg-white rounded-2xl shadow-md p-8">
							<h2 class="text-2xl font-bold text-gray-800 mb-6">Instructions</h2>
							<ol class="space-y-6">
								{#each parseInstructions($recipeData.instructions) as instruction, index}
									<li class="flex gap-4">
										<div class="flex-shrink-0">
											<div
												class="flex items-center justify-center h-10 w-10 rounded-full bg-orange-500 text-white font-bold">
												{index + 1}.
											</div>
										</div>
										<div class="flex-grow">
											<p class="text-gray-700 leading-relaxed">{instruction}</p>
										</div>
									</li>
								{/each}
							</ol>
						</div>

						<!-- Action buttons -->
						<div class="flex gap-4 mt-8">
							<button
								on:click={() => alert('Ajouter au panier')}
								class="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition duration-200 shadow-md hover:shadow-lg">
								❤️ Aimer ({$recipeData.total_likes})
							</button>
							<button
								on:click={() => alert('Ajouter à votre liste de courses')}
								class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl transition duration-200 shadow-md hover:shadow-lg">
								📤 Partager
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		background-color: #fafaf9;
	}
</style>
