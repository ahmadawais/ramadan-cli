import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	fetchCalendarByAddress,
	fetchHijriCalendarByAddress,
	fetchTimingsByAddress,
} from '../api.js';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const samplePrayerDay = {
	timings: {
		Fajr: '05:30',
		Sunrise: '06:45',
		Dhuhr: '12:30',
		Asr: '15:45',
		Sunset: '18:15',
		Maghrib: '18:15',
		Isha: '19:45',
		Imsak: '05:20',
		Midnight: '00:00',
		Firstthird: '22:00',
		Lastthird: '02:00',
	},
	date: {
		readable: '01 Feb 2026',
		timestamp: '1738368000',
		hijri: {
			date: '03-09-1447',
			day: '3',
			month: { number: 9, en: 'Ramadan', ar: 'رَمَضَان' },
			year: '1447',
			weekday: { en: 'Sunday', ar: 'الأحد' },
		},
		gregorian: {
			date: '01-02-2026',
			day: '01',
			month: { number: 2, en: 'February' },
			year: '2026',
			weekday: { en: 'Sunday' },
		},
	},
	meta: {
		latitude: 31.5204,
		longitude: 74.3587,
		timezone: 'Asia/Karachi',
		method: { id: 1, name: 'Karachi' },
		school: { id: 1, name: 'Hanafi' },
	},
};

describe('api boundaries', () => {
	beforeEach(() => {
		mockFetch.mockReset();
	});

	it('fetches timings by address with validated payload', async () => {
		mockFetch.mockResolvedValueOnce({
			json: async () => ({
				code: 200,
				status: 'OK',
				data: samplePrayerDay,
			}),
		});

		const data = await fetchTimingsByAddress({ address: 'Lahore' });
		expect(data.timings.Fajr).toBe('05:30');
		expect(mockFetch.mock.calls[0]?.[0]).toContain('timingsByAddress');
	});

	it('fetches hijri calendar by address with validated payload', async () => {
		mockFetch.mockResolvedValueOnce({
			json: async () => ({
				code: 200,
				status: 'OK',
				data: [samplePrayerDay],
			}),
		});

		const data = await fetchHijriCalendarByAddress({
			address: 'Lahore',
			year: 1447,
			month: 9,
		});
		expect(data).toHaveLength(1);
		expect(mockFetch.mock.calls[0]?.[0]).toContain(
			'hijriCalendarByAddress/1447/9'
		);
	});

	it('throws when response schema is invalid', async () => {
		mockFetch.mockResolvedValueOnce({
			json: async () => ({
				code: 200,
				status: 'OK',
				data: { invalid: true },
			}),
		});

		await expect(fetchTimingsByAddress({ address: 'Nowhere' })).rejects.toThrow(
			'Invalid API response'
		);
	});

	it('throws readable API error for non-200 responses', async () => {
		mockFetch.mockResolvedValueOnce({
			json: async () => ({
				code: 400,
				status: 'BAD_REQUEST',
				data: 'invalid address',
			}),
		});

		await expect(fetchTimingsByAddress({ address: 'Nowhere' })).rejects.toThrow(
			'API 400: BAD_REQUEST'
		);
	});

	it('throws API message when code 200 returns string data', async () => {
		mockFetch.mockResolvedValueOnce({
			json: async () => ({
				code: 200,
				status: 'OK',
				data: 'No data found for this location',
			}),
		});

		await expect(fetchTimingsByAddress({ address: 'Nowhere' })).rejects.toThrow(
			'API returned message: No data found for this location'
		);
	});

	it('accepts live-like payload where meta.school is a string', async () => {
		mockFetch.mockResolvedValueOnce({
			json: async () => ({
				code: 200,
				status: 'OK',
				data: {
					...samplePrayerDay,
					meta: {
						...samplePrayerDay.meta,
						school: 'STANDARD',
					},
				},
			}),
		});

		const data = await fetchTimingsByAddress({ address: 'Vancouver, Canada' });
		expect(data.timings.Maghrib).toBe('18:15');
		expect(data.meta.school).toBe('STANDARD');
	});

	it('fetches gregorian calendar by address with validated payload', async () => {
		mockFetch.mockResolvedValueOnce({
			json: async () => ({
				code: 200,
				status: 'OK',
				data: [samplePrayerDay],
			}),
		});

		const data = await fetchCalendarByAddress({
			address: 'Lahore',
			year: 2026,
			month: 2,
		});
		expect(data).toHaveLength(1);
		expect(mockFetch.mock.calls[0]?.[0]).toContain('calendarByAddress/2026/2');
	});
});
