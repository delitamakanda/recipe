<script lang="ts">
    import { fly } from 'svelte/transition';
</script>
<svelte:head>
    <title>Recipes</title>
</svelte:head>
<section in:fly={{ y: -100, duration: 500, delay: 500 }} out:fly={{ duration: 500 }}>
    <h1>Welcome to SvelteKit</h1>
    <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
</section>
