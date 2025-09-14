import type { User } from '$lib/interfaces/user.interface';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const userData = writable<User>({} as User);

export const isAuthenticated = writable<boolean>(false);

if (browser) {
	const storedToken = localStorage.getItem('token');
	if (storedToken === 'true') {
		isAuthenticated.set(true);
	}
	isAuthenticated.subscribe((isAuthenticated) => {
		localStorage.setItem('token', String(isAuthenticated));
	});
	userData.subscribe((userData) => {
		isAuthenticated.set(!!userData);
	});
}
