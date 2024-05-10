<script lang="ts">
    import { fly } from 'svelte/transition';
    import { userData } from '$lib/store/user';
</script>
<svelte:head>
    <title>Recipes</title>
</svelte:head>
<section in:fly={{ y: -100, duration: 500, delay: 500 }} out:fly={{ duration: 500 }}>
    <h1>Recipes</h1>
    {#if $userData.username}
    {$userData.username}
    {/if}
</section>
