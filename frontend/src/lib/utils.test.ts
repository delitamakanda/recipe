import { describe, it, expect } from 'vitest';

describe('Basic test suite', () => {
	it('should pass a simple assertion', () => {
		expect(true).toBe(true);
	});

	it('should perform basic arithmetic', () => {
		expect(1 + 1).toBe(2);
	});
});
