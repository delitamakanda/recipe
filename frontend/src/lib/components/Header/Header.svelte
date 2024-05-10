<script lang="ts">
    import { page } from "$app/stores";
    import { userData } from "$lib/store/user";
    import { logoutUser } from "$lib/utils/requestUtils";
</script>

<header>
    <nav>
        <ul>
            <li class:active={$page.url.pathname=== '/'}>
                <a svelkit:prefetch href="/">Home</a>
            </li>
            {#if !$userData.username}
            <li class:active={$page.url.pathname=== '/accounts/login'}>
                <a svelkit:prefetch href="/accounts/login">Login</a>
            </li>
            <li class:active={$page.url.pathname=== '/accounts/register'}>
                <a svelkit:prefetch href="/accounts/register">Signup</a>
            </li>
            {:else}
            <li>
                <a svelkit:prefetch href="/accounts/user/{$userData.username}-{$userData.id}">{$userData.username}</a>
            </li>
            <li>
                <a svelkit:prefetch href={null} on:click={logoutUser}>Logout</a>
            </li>
            {/if}
        </ul>
    </nav>
</header>