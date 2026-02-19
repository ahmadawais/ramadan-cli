import type { Locale } from '../index.js';

const id: Locale = {
	// CLI descriptions
	cliDescription: 'CLI Ramadan untuk jadwal Sahur dan Berbuka',
	cliCityArg: 'Nama kota (misal "Jakarta", "Surabaya", "Bandung", "Medan")',
	cliCityOption: 'Kota',
	cliAllOption: 'Tampilkan seluruh bulan Ramadan',
	cliNumberOption: 'Tampilkan hari puasa tertentu (1-30)',
	cliPlainOption: 'Output teks biasa',
	cliJsonOption: 'Output JSON',
	cliStatusOption:
		'Output satu baris (hanya jadwal berikutnya, untuk status bar)',
	cliFirstRozaDateOption: 'Atur dan gunakan tanggal puasa pertama kustom',
	cliClearFirstRozaDateOption:
		'Hapus tanggal puasa pertama kustom dan gunakan tanggal Ramadan dari API',
	cliLangOption: 'Atur bahasa tampilan (en, id)',
	cliResetDescription: 'Hapus konfigurasi Ramadan CLI yang tersimpan',
	cliConfigDescription: 'Konfigurasi pengaturan Ramadan CLI (non-interaktif)',
	cliConfigCityOption: 'Simpan kota',
	cliConfigCountryOption: 'Simpan negara',
	cliConfigLatitudeOption: 'Simpan lintang (-90 s/d 90)',
	cliConfigLongitudeOption: 'Simpan bujur (-180 s/d 180)',
	cliConfigMethodOption: 'Simpan metode perhitungan (0-23)',
	cliConfigSchoolOption: 'Simpan mazhab (0=Syafii, 1=Hanafi)',
	cliConfigTimezoneOption: 'Simpan zona waktu (misal Asia/Jakarta)',
	cliConfigLangOption: 'Simpan bahasa tampilan (en, id)',
	cliConfigShowOption: 'Tampilkan konfigurasi saat ini',
	cliConfigClearOption: 'Hapus konfigurasi tersimpan',
	cliRozaNumberError: 'Nomor puasa harus antara 1 dan 30.',

	// Setup prompts
	setupIntro: '🌙 Pengaturan Ramadan CLI',
	setupDetecting: '🌙 Mendeteksi lokasi Anda...',
	setupDetected: 'Terdeteksi: {city}, {country}',
	setupDetectFailed: 'Tidak dapat mendeteksi lokasi',
	setupEnterCity: 'Masukkan kota Anda',
	setupCityPlaceholder: 'misal Jakarta',
	setupCityRequired: 'Kota wajib diisi.',
	setupInvalidCity: 'Nilai kota tidak valid.',
	setupEnterCountry: 'Masukkan negara Anda',
	setupCountryPlaceholder: 'misal Indonesia',
	setupCountryRequired: 'Negara wajib diisi.',
	setupInvalidCountry: 'Nilai negara tidak valid.',
	setupResolvingCity: '🌙 Mencari detail kota...',
	setupDetectedTimezone: 'Zona waktu terdeteksi: {timezone}',
	setupTimezoneDetectFailed: 'Tidak dapat mendeteksi zona waktu untuk kota ini',
	setupSelectMethod: 'Pilih metode perhitungan',
	setupInvalidMethod: 'Pilihan metode tidak valid.',
	setupSelectSchool: 'Pilih mazhab Ashar',
	setupInvalidSchool: 'Pilihan mazhab tidak valid.',
	setupTimezonePreference: 'Preferensi zona waktu',
	setupUseDetectedTimezone: 'Gunakan zona waktu terdeteksi ({timezone})',
	setupSetCustomTimezone: 'Atur zona waktu kustom',
	setupSkipTimezone: 'Jangan atur zona waktu',
	setupEnterTimezone: 'Masukkan zona waktu',
	setupTimezonePlaceholder: 'misal Asia/Jakarta',
	setupTimezoneRequired: 'Zona waktu wajib diisi.',
	setupInvalidTimezone: 'Nilai zona waktu tidak valid.',
	setupComplete: '🌙 Pengaturan selesai.',
	setupCancelled: 'Pengaturan dibatalkan',
	setupSelectLanguage: 'Pilih bahasa tampilan',

	// Setup - method/school labels
	setupRecommended: '(Direkomendasikan)',
	setupBasedOnCountry: 'Berdasarkan negara Anda',
	setupHanafi: 'Hanafi',
	setupShafi: 'Syafii',
	setupLaterAsrTiming: 'Waktu Ashar lebih akhir',
	setupStandardAsrTiming: 'Waktu Ashar standar',

	// Table headers
	tableHeaderRoza: 'Puasa ke-',
	tableHeaderSehar: 'Sahur',
	tableHeaderIftar: 'Berbuka',
	tableHeaderDate: 'Tanggal',
	tableHeaderHijri: 'Hijriyah',

	// Highlight / status labels
	highlightBeforeRozaDay: 'Sebelum hari puasa',
	highlightFirstSehar: 'Sahur pertama',
	highlightSeharWindowOpen: 'Waktu sahur terbuka',
	highlightRozaStartsFajr: 'Puasa dimulai (Subuh)',
	highlightRozaInProgress: 'Sedang berpuasa',
	highlightIftar: 'Berbuka',
	highlightIftarTime: 'Waktu berbuka',
	highlightNextDaySehar: 'Sahur hari berikutnya',

	// Row annotations
	annotationCurrent: '← hari ini',
	annotationNext: '← berikutnya',

	// Status line labels
	statusSehar: 'Sahur',
	statusFastStarts: 'Puasa dimulai',
	statusIn: 'dalam',

	// Output titles
	titleAllDays: 'Ramadan {year} (Semua Hari)',
	titleRozaSeharIftar: 'Puasa ke-{roza} Sahur/Berbuka',
	titleTodaySeharIftar: 'Sahur/Berbuka Hari Ini',

	// Output labels
	outputStatus: 'Status:',
	outputUpNext: 'Berikutnya:',
	outputIn: 'dalam',
	outputFooter:
		'Sahur menggunakan waktu Subuh. Berbuka menggunakan waktu Maghrib.',

	// Banner
	bannerLabel: '🌙 Ramadan CLI',
	bannerTagline: 'Sahur • Berbuka • Jadwal Ramadan',

	// Spinner
	spinnerFetching: 'Mengambil jadwal Ramadan...',
	spinnerFailed: 'Gagal mengambil jadwal Ramadan',

	// Config command
	configCleared: 'Konfigurasi dihapus.',
	configUpdated: 'Konfigurasi diperbarui.',
	configNoUpdates:
		'Tidak ada pembaruan konfigurasi. Gunakan `ramadan-cli config --show` untuk melihat.',
	configCurrentTitle: 'Konfigurasi saat ini:',
	configReset: 'Konfigurasi direset.',

	// Config labels
	configLabelCity: 'Kota',
	configLabelCountry: 'Negara',
	configLabelLatitude: 'Lintang',
	configLabelLongitude: 'Bujur',
	configLabelMethod: 'Metode',
	configLabelSchool: 'Mazhab',
	configLabelTimezone: 'Zona Waktu',
	configLabelFirstRozaDate: 'Tanggal Puasa Pertama',
	configLabelLanguage: 'Bahasa',

	// Errors
	errorInvalidFirstRozaDate:
		'Tanggal puasa pertama tidak valid. Gunakan format YYYY-MM-DD.',
	errorUseAllOrNumber: 'Gunakan --all atau --number, jangan keduanya.',
	errorCouldNotFetchPrayer: 'Tidak dapat mengambil waktu shalat. {details}',
	errorCouldNotFetchCalendar:
		'Tidak dapat mengambil kalender Ramadan. {details}',
	errorCouldNotDetectLocation:
		'Tidak dapat mendeteksi lokasi. Masukkan kota seperti `ramadan-cli "Jakarta"`.',
	errorCouldNotFindRoza: 'Tidak dapat menemukan jadwal puasa ke-{number}.',
	errorCouldNotParseDate:
		'Tidak dapat memproses tanggal Masehi dari respons shalat.',
	errorCouldNotDetermineFirstRoza:
		'Tidak dapat menentukan tanggal puasa pertama.',
	errorCouldNotDetermineRoza: 'Tidak dapat menentukan nomor puasa.',
	errorCouldNotFindFirstDay: 'Tidak dapat menemukan hari pertama Ramadan.',
	errorInvalidLatitude: 'Lintang tidak valid.',
	errorInvalidLongitude: 'Bujur tidak valid.',
	errorInvalidMethod: 'Metode tidak valid.',
	errorInvalidSchool: 'Mazhab tidak valid.',

	// Language names
	langEnglish: 'English',
	langIndonesian: 'Bahasa Indonesia',
};

export default id;
