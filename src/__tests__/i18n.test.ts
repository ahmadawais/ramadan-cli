import { afterEach, describe, expect, it } from 'vitest';
import { getLocale, setLocale, t } from '../i18n/index.js';

describe('i18n', () => {
	afterEach(() => {
		setLocale('en');
	});

	it('defaults to English locale', () => {
		expect(getLocale()).toBe('en');
		expect(t('tableHeaderRoza')).toBe('Roza');
	});

	it('switches to Indonesian locale', () => {
		setLocale('id');
		expect(getLocale()).toBe('id');
		expect(t('tableHeaderRoza')).toBe('Puasa ke-');
		expect(t('tableHeaderSehar')).toBe('Sahur');
		expect(t('tableHeaderIftar')).toBe('Berbuka');
	});

	it('switches back to English', () => {
		setLocale('id');
		setLocale('en');
		expect(getLocale()).toBe('en');
		expect(t('tableHeaderRoza')).toBe('Roza');
	});

	it('ignores unsupported languages', () => {
		setLocale('fr');
		expect(getLocale()).toBe('en');
		expect(t('tableHeaderRoza')).toBe('Roza');
	});

	it('interpolates template parameters', () => {
		expect(t('titleAllDays', { year: 1447 })).toBe('Ramadan 1447 (All Days)');
		setLocale('id');
		expect(t('titleAllDays', { year: 1447 })).toBe('Ramadan 1447 (Semua Hari)');
	});

	it('interpolates multiple params', () => {
		expect(t('setupDetected', { city: 'Lahore', country: 'Pakistan' })).toBe(
			'Detected: Lahore, Pakistan'
		);
		setLocale('id');
		expect(t('setupDetected', { city: 'Jakarta', country: 'Indonesia' })).toBe(
			'Terdeteksi: Jakarta, Indonesia'
		);
	});

	it('translates highlight states in Indonesian', () => {
		setLocale('id');
		expect(t('highlightSeharWindowOpen')).toBe('Waktu sahur terbuka');
		expect(t('highlightRozaInProgress')).toBe('Sedang berpuasa');
		expect(t('highlightIftar')).toBe('Berbuka');
		expect(t('highlightIftarTime')).toBe('Waktu berbuka');
	});

	it('translates config messages in Indonesian', () => {
		setLocale('id');
		expect(t('configCleared')).toBe('Konfigurasi dihapus.');
		expect(t('configUpdated')).toBe('Konfigurasi diperbarui.');
		expect(t('configReset')).toBe('Konfigurasi direset.');
	});

	it('translates banner texts in Indonesian', () => {
		setLocale('id');
		expect(t('bannerTagline')).toBe('Sahur • Berbuka • Jadwal Ramadan');
	});

	it('translates CLI description in Indonesian', () => {
		setLocale('id');
		expect(t('cliDescription')).toBe(
			'CLI Ramadan untuk jadwal Sahur dan Berbuka'
		);
	});
});
