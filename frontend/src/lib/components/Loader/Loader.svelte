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
<div class="loader-container">
    <div class="loader" />
    {#if $loading.message}
    <p> Loading... </p>
    {/if}
</div>
{/if}

<style>
    :root {
        --size: 80px;
    }
    .loader-container {
        position: fixed;
        top: 3rem;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
        background-color: #b9b9b9;
        background: linear-gradient(180deg, #ffffff 0%, #b9b9b9 100%);
    }
    .loader {
        --b: 20px;
        --n: 15;
        --g: 7deg;
        --c: #ff3e00;

        width: var(--size);
        aspect-ratio: 1;
        animation: load 1.5s infinite steps(--n);
        border-radius: 50%;
        padding: 1px;
        background: conic-gradient(#000, var(--c)) content-box;
        -webkit-mask: /* we use +/-1deg between colors to avoid jagged edges */ repeating-conic-gradient(
				#0000 0deg,
				#000 1deg calc(360deg / var(--n) - var(--g) - 1deg),
				#0000 calc(360deg / var(--n) - var(--g)) calc(360deg / var(--n))
			),
			radial-gradient(farthest-side, #0000 calc(98% - var(--b)), #000 calc(100% - var(--b)));
		mask: repeating-conic-gradient(
				#0000 0deg,
				#000 1deg calc(360deg / var(--n) - var(--g) - 1deg),
				#0000 calc(360deg / var(--n) - var(--g)) calc(360deg / var(--n))
			),
			radial-gradient(farthest-side, #0000 calc(98% - var(--b)), #000 calc(100% - var(--b)));
		-webkit-mask-composite: destination-in;
		mask-composite: intersect;
    }
    @keyframes load {
        to {
            transform: rotate(1turn);
        }
    }
</style>