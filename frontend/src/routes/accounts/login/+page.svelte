<script lang="ts">
    import { fly } from 'svelte/transition';
    import { notificationData } from '$lib/store/notification';
    import { goto } from '$app/navigation';
    import { variables } from '$lib/utils/constants';
    import { post, browserGet, browserSet } from '$lib/utils/requestUtils';
	import { changeText } from '$lib/helpers/buttonText';
    
    let email: string = '';
    let password: string = '';
    let rememberMe: boolean = false;
    let errors: Array<string> = [];

    const handleSubmit = async () => {
        if (browserGet('refreshToken')) {
            localStorage.removeItem('refreshToken');
        }
        const [jsonResponse, jsonError] = await post(fetch, `${variables.BASE_API_URL}/auth/login`, {
            user: { email, password },
        });


        const response: any = jsonResponse;

        if (jsonError) {
            errors = jsonError.errors;
        } else if (response.access_token) {
            browserSet('accessToken', response.access_token);
            browserSet('refreshToken', response.refresh_token);
            notificationData.update(() => 'Logged in successfully!');
            await goto('/');
        }
    };
</script>
<svelte:head>
    <title>Login</title>
</svelte:head>

<section class="container" in:fly={{ x: -100, duration: 500, delay: 500 }} out:fly={{ duration: 500 }}>
    <h1>Login</h1>

    <form on:submit|preventDefault={handleSubmit}>
        <input type="email" bind:value={email} placeholder="Email" required />
        <input type="password" bind:value={password} placeholder="Password" required />
        <div class="form-group">
            <input type="checkbox" bind:checked={rememberMe} />
            <label for="rememberMe">Remember Me</label>
        </div>
        {#if errors.length}
        <ul>
            {#each errors as error}
            <li>{error}</li>
            {/each}
        </ul>
        {/if}
        <button type="submit" on:click={(e) => changeText(e, 'Signin')}>Login</button>
        <p>Don't have an account? <a href="/accounts/register">Register now</a></p>
    </form>
</section>