import { describe, expect, it } from 'vitest';
import { getMethodOptions, getSchoolOptions } from '../setup.js';

describe('setup option builders', () => {
	it('puts recommended method first without duplicates', () => {
		const options = getMethodOptions(1);
		expect(options[0]?.value).toBe(1);
		expect(options[0]?.label.includes('(Recommended)')).toBe(true);
		const methodOneCount = options.filter((option) => option.value === 1).length;
		expect(methodOneCount).toBe(1);
	});

	it('returns default method list when no recommendation exists', () => {
		const options = getMethodOptions(null);
		expect(options.length).toBeGreaterThan(10);
		expect(options[0]?.value).toBe(0);
	});

	it('puts Hanafi first when Hanafi is recommended', () => {
		const options = getSchoolOptions(1);
		expect(options[0]?.value).toBe(1);
		expect(options[0]?.label.includes('(Recommended)')).toBe(true);
	});

	it('puts Shafi first when Shafi is recommended', () => {
		const options = getSchoolOptions(0);
		expect(options[0]?.value).toBe(0);
		expect(options[0]?.label.includes('(Recommended)')).toBe(true);
	});
});
