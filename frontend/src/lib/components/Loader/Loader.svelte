<script lang="ts">
    import { loading } from "$lib/store/loading";

    $: if ($loading.status === "NAVIGATING") {
        setTimeout(() => {
            if ($loading.status === "NAVIGATING") {
                $loading.status = "LOADING"
            }
        }, 1000)
    }
</script>


{#if $loading.status === "LOADING"}
<div>
    Loading...
</div>
{/if}

<style>
    :root {
        --size: 80px;
    }
</style>