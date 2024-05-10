<script lang="ts">
    import { fly } from 'svelte/transition';
</script>
<svelte:head>
    <title>Login</title>
</svelte:head>

<section class="container" in:fly={{ x: -100, duration: 500, delay: 500 }} out:fly={{ duration: 500 }}>
    <h1>Login</h1>
</section>