<script lang="ts">
    import { page } from "$app/stores";
    import { userData } from "$lib/store/user";
    import { logoutUser } from "$lib/utils/requestUtils";
</script>

<header>
    <nav>
        <ul>
            <li class:active={$page.url.pathname=== '/'}>
                <a href="/">Home</a>
            </li>
            {#if !$userData?.username}
            <li class:active={$page.url.pathname=== '/accounts/login'}>
                <a href="/accounts/login">Login</a>
            </li>
            <li class:active={$page.url.pathname=== '/accounts/register'}>
                <a href="/accounts/register">Signup</a>
            </li>
            {:else}
            <li>
                <a href="/accounts/user/{$userData.username}-{$userData.id}">{$userData.username}</a>
            </li>
            <li>
                <a href={null} on:click={logoutUser}>Logout</a>
            </li>
            {/if}
        </ul>
    </nav>
</header>