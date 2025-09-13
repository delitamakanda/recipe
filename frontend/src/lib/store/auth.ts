import { writable } from 'svelte/store';
import { auth } from '$lib/firebase/config';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { browser } from '$app/environment';

export const userData = writable<User | null>(null);
export const userIsLoading = writable<boolean>(true);
export const userIsAuthenticated = writable<boolean>(false);

if (browser) {
	onAuthStateChanged(auth, (user) => {
		if (user) {
			userData.set(user);
			userIsAuthenticated.set(true);
			userIsLoading.set(false);
		} else {
			userData.set(null);
			userIsAuthenticated.set(false);
			userIsLoading.set(false);
		}
	});
}
