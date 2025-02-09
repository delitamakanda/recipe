<script lang="ts">
	import { fly } from 'svelte/transition';
	import { recipeData } from '$lib/store/recipe';
</script>

<div
	class="recipe"
	in:fly={{ y: -100, duration: 500, delay: 500 }}
	out:fly={{ duration: 500 }}>
	{#if $recipeData.id}
		<h1>{$recipeData.title}</h1>
		<p>{$recipeData.instructions}</p>
		<p>Servings: {$recipeData.servings}</p>
		<div class="ingredients">
			<h2>Ingredients</h2>
			<p>{$recipeData.ingredients}</p>
		</div>
		<div class="instructions">
			<h2>Instructions</h2>
			<p>{$recipeData.instructions}</p>
		</div>
	{/if}
</div>
