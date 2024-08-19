<script lang="ts">
    import { fly } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import { variables } from '$lib/utils/constants';
    import { notificationData } from '$lib/store/notification';
    import { post } from '$lib/utils/requestUtils';
    import { changeText } from '$lib/helpers/buttonText';

    let email: string = '';
    let password: string = '';
    let userName: string = '';
    let confirmPassword: string = '';
    let firstName: string = '';
    let lastName: string = '';
    let errors: Array<string> = [];
    let showPassword: boolean = false;

    const submitForm = async () => {
        const [jsonResponse, err ] = await post(fetch, variables.BASE_API_URL + '/auth/register', {
            user: {
                email,
                password,
                username: userName,
                first_name: firstName,
                last_name: lastName
            }
        });
        const response = jsonResponse as any;

        if (err) {
            errors = err;
        } else if (response) {
            notificationData.update(() => 'Registration successful! You can now log in.');
            await goto('/accounts/login');
        }
    }
</script>
<svelte:head>
    <title>Register</title>
</svelte:head>

<section class="container" in:fly={{ x: -100, duration: 500, delay: 500 }} out:fly={{ duration: 500 }}>
    <h1>Register</h1>
    {#if errors.length}
    {#each errors as error}
    <p class="error">{error}</p>
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

        <div class="form-group">

        <label for="username">Username:</label>
        <input type="text" id="username" bind:value={userName} required />
        </div>

        

            <div class="form-group">
                <label for="firstName">First Name:</label>
                <input type="text" id="firstName" bind:value={firstName} required />
            </div>

            <div class="form-group">
                <label for="lastName">Last Name:</label>
                <input type="text" id="lastName" bind:value={lastName} required />
            </div>
        </fieldset>
       
        {#if confirmPassword}
        <button type="submit" on:click={(e) => changeText(e, 'Signup')}>Signup</button>
        {:else}
        <button type="submit" disabled>Signup</button>
        {/if}
    </form>
</section>