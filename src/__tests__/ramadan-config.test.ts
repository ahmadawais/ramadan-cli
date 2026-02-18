import { beforeEach, describe, expect, it } from 'vitest';
import {
	clearRamadanConfig,
	clearStoredFirstRozaDate,
	getStoredFirstRozaDate,
	setStoredFirstRozaDate,
	shouldApplyRecommendedMethod,
	shouldApplyRecommendedSchool,
} from '../ramadan-config.js';

describe('ramadan config recommendation guards', () => {
	beforeEach(() => {
		clearRamadanConfig();
		clearStoredFirstRozaDate();
	});

	it('applies recommended method when current method is default', () => {
		expect(shouldApplyRecommendedMethod(2, 1)).toBe(true);
	});

	it('does not override custom non-default method', () => {
		expect(shouldApplyRecommendedMethod(3, 1)).toBe(false);
	});

	it('applies recommended school when current school is default', () => {
		expect(shouldApplyRecommendedSchool(0, 1)).toBe(true);
	});

	it('does not override custom non-default school', () => {
		expect(shouldApplyRecommendedSchool(1, 0)).toBe(false);
	});

	it('stores and reads custom first roza date', () => {
		setStoredFirstRozaDate('2026-02-19');
		expect(getStoredFirstRozaDate()).toBe('2026-02-19');
	});

	it('clears custom first roza date', () => {
		setStoredFirstRozaDate('2026-02-19');
		clearStoredFirstRozaDate();
		expect(getStoredFirstRozaDate()).toBeUndefined();
	});

	it('rejects invalid first roza date format', () => {
		expect(() => setStoredFirstRozaDate('19-02-2026')).toThrow(
			'Invalid first roza date. Use YYYY-MM-DD.'
		);
	});
});
