import { describe, expect, it } from 'vitest';
import {
	mergeLocationUpdates,
	parseConfigUpdates,
} from '../commands/config.js';

describe('parseConfigUpdates', () => {
	it('parses valid numeric config updates', () => {
		const parsed = parseConfigUpdates({
			method: '2',
			school: '1',
			latitude: '37.7749',
			longitude: '-122.4194',
		});

		expect(parsed.method).toBe(2);
		expect(parsed.school).toBe(1);
		expect(parsed.latitude).toBe(37.7749);
		expect(parsed.longitude).toBe(-122.4194);
	});

	it('throws for invalid method', () => {
		expect(() => parseConfigUpdates({ method: '100' })).toThrow(
			'Invalid method.'
		);
	});

	it('throws for invalid school', () => {
		expect(() => parseConfigUpdates({ school: '9' })).toThrow(
			'Invalid school.'
		);
	});
});

describe('mergeLocationUpdates', () => {
	it('keeps existing values when no location updates are passed', () => {
		const merged = mergeLocationUpdates(
			{
				city: 'Lahore',
				country: 'Pakistan',
				latitude: 31.5204,
				longitude: 74.3587,
			},
			{}
		);

		expect(merged.city).toBe('Lahore');
		expect(merged.country).toBe('Pakistan');
		expect(merged.latitude).toBe(31.5204);
		expect(merged.longitude).toBe(74.3587);
	});

	it('overrides only provided location fields', () => {
		const merged = mergeLocationUpdates(
			{
				city: 'Lahore',
				country: 'Pakistan',
				latitude: 31.5204,
				longitude: 74.3587,
			},
			{
				city: 'San Francisco',
			}
		);

		expect(merged.city).toBe('San Francisco');
		expect(merged.country).toBe('Pakistan');
		expect(merged.latitude).toBe(31.5204);
		expect(merged.longitude).toBe(74.3587);
	});
});
