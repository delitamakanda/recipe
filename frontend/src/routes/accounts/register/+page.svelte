<script lang="ts">
    import { fly } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import { variables } from '$lib/utils/constants';
    import { notificationData } from '$lib/store/notification';
    import { post } from '$lib/utils/requestUtils';
    import { changeText } from '$lib/helpers/buttonText';
    import type { CustomError } from '$lib/interfaces/error.interface';
    import type { UserResponse } from '$lib/interfaces/user.interface';

    let email: string = '';
    let userName: string = '';
    let password: string = '';
    let confirmPassword: string = '';
    let errors: Array<CustomError>;
    let showPassword: boolean = false;

    const submitForm = async () => {
        const [jsonResponse, err ] = await post(fetch, `${variables.BASE_API_URL}/register/`, {
            user: {
                email,
                password,
                username: userName,
            }
        });
        const response: UserResponse = jsonResponse;

        if (err.length > 0) {
            errors = err;
        } else if (response.user) {
            notificationData.update(() => 'Registration successful! You can now log in.');
            await goto('/accounts/login');
        }
    }
    const passwordConfirm = () => (password !== confirmPassword ? false : true);
</script>
<svelte:head>
    <title>Register</title>
</svelte:head>

<section class="container" in:fly={{ x: -100, duration: 500, delay: 500 }} out:fly={{ duration: 500 }}>
    <h1>Register</h1>
    {#if errors}
    {#each errors as error}
    <p class="error">{error.error}</p>
    {/each}
    {/if}

    <form on:submit|preventDefault={submitForm}>
        <fieldset>
            <legend>Personal informations</legend>
       <div class="form-group">
           <label for="email">Email:</label>
           <input type="email" id="email" bind:value={email} required />
       </div>

       <div class="form-group">

        <label for="username">Username:</label>
        <input type="text" id="username" bind:value={userName} required />
        </div>

       <div class="form-group">

        <label for="password">Password:</label>
        {#if showPassword} 
        <input type="text" id="password" bind:value={password} required />
        {:else}
        <input type="password" id="password" bind:value={password} required />
        {/if}
        </div>
        <div class="form-group">
            <label class="show-password">
                <input type="checkbox" id="showPassword" bind:checked={showPassword} />
                <span>Show Password</span>
            </label>
        </div>

        <div class="form-group">

        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" bind:value={confirmPassword} required />
        </div>

   
        </fieldset>
       
        {#if confirmPassword}
        <button type="submit" on:click={(e) => changeText(e, 'Signup')}>Signup</button>
        {:else}
        <button type="submit" disabled>Signup</button>
        {/if}
    </form>
</section>