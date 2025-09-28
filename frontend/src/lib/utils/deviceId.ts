import { browser } from '$app/environment';

export function getDeviceId(): string {
	if (!browser) {
		return '';
	}
	let deviceId = localStorage.getItem('deviceId');
	if (!deviceId) {
		deviceId = crypto.randomUUID();
		localStorage.setItem('deviceId', deviceId);
	}
	return deviceId;
}
