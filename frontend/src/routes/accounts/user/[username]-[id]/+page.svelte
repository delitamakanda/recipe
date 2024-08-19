<script lang="ts">
    import { fly } from 'svelte/transition';
    import { updateField } from '$lib/utils/requestUtils';
    import { nodeBefore } from '$lib/helpers/whiteSpaces';
    import { variables } from '$lib/utils/constants';
    export let data : unknown;

    const url = `${variables.BASE_API_URL}/me`;

    
</script>
<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<section class="container" in:fly={{ x: -100, duration: 500, delay: 500 }} out:fly={{ duration: 500 }}>
    <h1>Dashboard</h1>
</section>