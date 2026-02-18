import { describe, expect, it } from 'vitest';
import {
	getRozaNumberFromStartDate,
	getTargetRamadanYear,
	to12HourTime,
} from '../commands/ramadan.js';

const samplePrayerData = (month: number, year: string) => ({
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
			month: {
				number: month,
				en: 'Ramadan',
				ar: 'رَمَضَان',
			},
			year,
			weekday: {
				en: 'Sunday',
				ar: 'الأحد',
			},
		},
		gregorian: {
			date: '01-02-2026',
			day: '01',
			month: {
				number: 2,
				en: 'February',
			},
			year: '2026',
			weekday: {
				en: 'Sunday',
			},
		},
	},
	meta: {
		latitude: 31.5204,
		longitude: 74.3587,
		timezone: 'Asia/Karachi',
		method: {
			id: 1,
			name: 'Karachi',
		},
		school: {
			id: 1,
			name: 'Hanafi',
		},
	},
});

describe('getTargetRamadanYear', () => {
	it('uses current hijri year before Ramadan', () => {
		expect(getTargetRamadanYear(samplePrayerData(8, '1447'))).toBe(1447);
	});

	it('moves to next hijri year after Ramadan', () => {
		expect(getTargetRamadanYear(samplePrayerData(10, '1447'))).toBe(1448);
	});
});

describe('getRozaNumberFromStartDate', () => {
	it('returns roza 1 on first configured roza day', () => {
		const firstRozaDate = new Date(Date.UTC(2026, 1, 18));
		const targetDate = new Date(Date.UTC(2026, 1, 18));
		expect(getRozaNumberFromStartDate(firstRozaDate, targetDate)).toBe(1);
	});

	it('returns incremental roza number for later dates', () => {
		const firstRozaDate = new Date(Date.UTC(2026, 1, 18));
		const targetDate = new Date(Date.UTC(2026, 1, 20));
		expect(getRozaNumberFromStartDate(firstRozaDate, targetDate)).toBe(3);
	});

	it('returns zero or less for dates before first roza', () => {
		const firstRozaDate = new Date(Date.UTC(2026, 1, 18));
		const targetDate = new Date(Date.UTC(2026, 1, 17));
		expect(getRozaNumberFromStartDate(firstRozaDate, targetDate)).toBe(0);
	});
});

describe('to12HourTime', () => {
	it('formats 24-hour time to 12-hour with AM/PM', () => {
		expect(to12HourTime('05:48')).toBe('5:48 AM');
		expect(to12HourTime('17:38')).toBe('5:38 PM');
	});

	it('strips timezone suffix before formatting', () => {
		expect(to12HourTime('17:38 (PST)')).toBe('5:38 PM');
	});

	it('keeps invalid values unchanged', () => {
		expect(to12HourTime('not-a-time')).toBe('not-a-time');
	});
});
