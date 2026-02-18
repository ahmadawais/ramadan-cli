import { describe, expect, it } from 'vitest';
import {
	getRecommendedMethod,
	getRecommendedSchool,
} from '../recommendations.js';

describe('recommendations', () => {
	it('returns method by country', () => {
		expect(getRecommendedMethod('Pakistan')).toBe(1);
		expect(getRecommendedMethod('United States')).toBe(2);
	});

	it('is case-insensitive for method lookup', () => {
		expect(getRecommendedMethod('pakistan')).toBe(1);
		expect(getRecommendedMethod('usa')).toBe(2);
	});

	it('returns school recommendation', () => {
		expect(getRecommendedSchool('Pakistan')).toBe(1);
		expect(getRecommendedSchool('Canada')).toBe(0);
	});
});
