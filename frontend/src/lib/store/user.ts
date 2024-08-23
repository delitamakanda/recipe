import type { User } from "$lib/interfaces/user.interface";
import { writable } from "svelte/store";

export const userData = writable<User>({} as User);
