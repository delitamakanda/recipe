<script lang="ts">
	import { fly } from 'svelte/transition';
	import { notificationData } from '$lib/store/notification';
	import { goto } from '$app/navigation';
	import { variables } from '$lib/utils/constants';
	import { post, browserGet, browserSet } from '$lib/utils/requestUtils';
	import { changeText } from '$lib/helpers/buttonText';
	import type { CustomError } from '$lib/interfaces/error.interface';
	import type { UserResponse } from '$lib/interfaces/user.interface';

	let username: string = '';
	let password: string = '';
	let rememberMe: boolean = false;
	let errors: Array<CustomError> = [];

	const handleSubmit = async () => {
		if (browserGet('refreshToken')) {
			localStorage.removeItem('refreshToken');
		}
		const [jsonResponse, jsonError] = await post({
			fetch: fetch,
			url: `${variables.BASE_API_URL}/login/`,
			body: {
				user: { username, password }
			}
		});

		const response: UserResponse = jsonResponse;

		if (jsonError.length > 0) {
			errors = jsonError;
		} else if (response.user) {
			if (response.user.tokens && response.user.tokens.refresh) {
				browserSet('accessToken', response.user.tokens.access);
				browserSet('refreshToken', response.user.tokens.refresh);
			}
			notificationData.update(() => 'Logged in successfully!');
			await goto('/');
		}
	};
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<section
	class="flex w-full flex-col items-center gap-12 p-7"
	in:fly={{ x: -100, duration: 500, delay: 500 }}
	out:fly={{ duration: 500 }}>
	<h1>Login</h1>

	<form on:submit|preventDefault={handleSubmit}>
		<input type="email" bind:value={username} placeholder="Email" required />
		<input type="password" bind:value={password} placeholder="Password" required />
		<div class="form-group">
			<input type="checkbox" bind:checked={rememberMe} />
			<label for="rememberMe">Remember Me</label>
		</div>
		{#if errors}
			<ul>
				{#each errors as error}
					<li>{error.error}</li>
				{/each}
			</ul>
		{/if}
		<button type="submit" on:click={(e) => changeText(e, 'Signin')}>Login</button>
		<p>Don't have an account? <a href="/accounts/register">Register now</a></p>
	</form>
</section>
