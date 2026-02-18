import ora from 'ora';
import pc from 'picocolors';
import {
	type PrayerData,
	fetchHijriCalendarByAddress,
	fetchHijriCalendarByCity,
	fetchTimingsByAddress,
	fetchTimingsByCity,
	fetchTimingsByCoords,
} from '../api.js';
import { type GeoLocation, guessCityCountry, guessLocation } from '../geo.js';
import {
	clearStoredFirstRozaDate,
	getStoredFirstRozaDate,
	getStoredLocation,
	getStoredPrayerSettings,
	hasStoredLocation,
	saveAutoDetectedSetup,
	setStoredFirstRozaDate,
	shouldApplyRecommendedMethod,
	shouldApplyRecommendedSchool,
} from '../ramadan-config.js';
import {
	getRecommendedMethod,
	getRecommendedSchool,
} from '../recommendations.js';
import { canPromptInteractively, runFirstRunSetup } from '../setup.js';
import { getBanner } from '../ui/banner.js';
import { ramadanGreen } from '../ui/theme.js';

export interface RamadanCommandOptions {
	readonly city?: string | undefined;
	readonly all?: boolean | undefined;
	readonly rozaNumber?: number | undefined;
	readonly plain?: boolean | undefined;
	readonly json?: boolean | undefined;
	readonly status?: boolean | undefined;
	readonly firstRozaDate?: string | undefined;
	readonly clearFirstRozaDate?: boolean | undefined;
}

interface RamadanRow {
	readonly roza: number;
	readonly sehar: string;
	readonly iftar: string;
	readonly date: string;
	readonly hijri: string;
}

interface RamadanOutput {
	readonly mode: 'today' | 'all' | 'number';
	readonly location: string;
	readonly hijriYear: number;
	readonly rows: ReadonlyArray<RamadanRow>;
}

interface JsonErrorPayload {
	readonly ok: false;
	readonly error: {
		readonly code: string;
		readonly message: string;
	};
}

interface HighlightState {
	readonly current: string;
	readonly next: string;
	readonly countdown: string;
}

type RowAnnotationKind = 'current' | 'next';

interface RamadanQuery {
	readonly address: string;
	readonly city?: string | undefined;
	readonly country?: string | undefined;
	readonly latitude?: number | undefined;
	readonly longitude?: number | undefined;
	readonly method?: number | undefined;
	readonly school?: number | undefined;
	readonly timezone?: string | undefined;
}

const CITY_ALIAS_MAP: Readonly<Record<string, string>> = {
	sf: 'San Francisco',
};

export const normalizeCityAlias = (city: string): string => {
	const trimmed = city.trim();
	const alias = CITY_ALIAS_MAP[trimmed.toLowerCase()];
	if (!alias) {
		return trimmed;
	}
	return alias;
};

export const to12HourTime = (value: string): string => {
	const cleanValue = value.split(' ')[0] ?? value;
	const match = cleanValue.match(/^(\d{1,2}):(\d{2})$/);
	if (!match) {
		return cleanValue;
	}

	const hour = Number.parseInt(match[1] ?? '', 10);
	const minute = Number.parseInt(match[2] ?? '', 10);
	const isInvalidTime =
		Number.isNaN(hour) ||
		Number.isNaN(minute) ||
		hour < 0 ||
		hour > 23 ||
		minute < 0 ||
		minute > 59;

	if (isInvalidTime) {
		return cleanValue;
	}

	const period = hour >= 12 ? 'PM' : 'AM';
	const twelveHour = hour % 12 || 12;
	return `${twelveHour}:${String(minute).padStart(2, '0')} ${period}`;
};

const toRamadanRow = (day: PrayerData, roza: number): RamadanRow => ({
	roza,
	sehar: to12HourTime(day.timings.Fajr),
	iftar: to12HourTime(day.timings.Maghrib),
	date: day.date.readable,
	hijri: `${day.date.hijri.day} ${day.date.hijri.month.en} ${day.date.hijri.year}`,
});

const getRozaNumberFromHijriDay = (day: PrayerData): number => {
	const parsed = Number.parseInt(day.date.hijri.day, 10);
	if (Number.isNaN(parsed)) {
		return 1;
	}
	return parsed;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTES_IN_DAY = 24 * 60;

const parseIsoDate = (value: string): Date | null => {
	const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	if (!match) {
		return null;
	}

	const year = Number.parseInt(match[1] ?? '', 10);
	const month = Number.parseInt(match[2] ?? '', 10);
	const day = Number.parseInt(match[3] ?? '', 10);

	const date = new Date(year, month - 1, day);
	const isValid =
		date.getFullYear() === year &&
		date.getMonth() === month - 1 &&
		date.getDate() === day;

	if (!isValid) {
		return null;
	}

	return date;
};

const parseGregorianDate = (value: string): Date | null => {
	const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
	if (!match) {
		return null;
	}

	const day = Number.parseInt(match[1] ?? '', 10);
	const month = Number.parseInt(match[2] ?? '', 10);
	const year = Number.parseInt(match[3] ?? '', 10);

	const date = new Date(year, month - 1, day);
	const isValid =
		date.getFullYear() === year &&
		date.getMonth() === month - 1 &&
		date.getDate() === day;

	if (!isValid) {
		return null;
	}

	return date;
};

const addDays = (date: Date, days: number): Date => {
	const next = new Date(date);
	next.setDate(next.getDate() + days);
	return next;
};

const toUtcDateOnlyMs = (date: Date): number =>
	Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

export const getRozaNumberFromStartDate = (
	firstRozaDate: Date,
	targetDate: Date
): number =>
	Math.floor(
		(toUtcDateOnlyMs(targetDate) - toUtcDateOnlyMs(firstRozaDate)) / DAY_MS
	) + 1;

const parsePrayerTimeToMinutes = (value: string): number | null => {
	const cleanValue = value.split(' ')[0] ?? value;
	const match = cleanValue.match(/^(\d{1,2}):(\d{2})$/);
	if (!match) {
		return null;
	}

	const hour = Number.parseInt(match[1] ?? '', 10);
	const minute = Number.parseInt(match[2] ?? '', 10);
	const isInvalid =
		Number.isNaN(hour) ||
		Number.isNaN(minute) ||
		hour < 0 ||
		hour > 23 ||
		minute < 0 ||
		minute > 59;

	if (isInvalid) {
		return null;
	}

	return hour * 60 + minute;
};

const parseGregorianDay = (
	value: string
): Readonly<{ year: number; month: number; day: number }> | null => {
	const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
	if (!match) {
		return null;
	}

	const day = Number.parseInt(match[1] ?? '', 10);
	const month = Number.parseInt(match[2] ?? '', 10);
	const year = Number.parseInt(match[3] ?? '', 10);
	const isInvalid =
		Number.isNaN(day) ||
		Number.isNaN(month) ||
		Number.isNaN(year) ||
		day < 1 ||
		day > 31 ||
		month < 1 ||
		month > 12;

	if (isInvalid) {
		return null;
	}

	return { year, month, day };
};

const nowInTimezoneParts = (
	timezone: string
): Readonly<{
	year: number;
	month: number;
	day: number;
	minutes: number;
}> | null => {
	try {
		const formatter = new Intl.DateTimeFormat('en-GB', {
			timeZone: timezone,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		});
		const parts = formatter.formatToParts(new Date());
		const toNumber = (type: Intl.DateTimeFormatPartTypes): number | null => {
			const part = parts.find((item) => item.type === type)?.value;
			if (!part) {
				return null;
			}
			const parsed = Number.parseInt(part, 10);
			if (Number.isNaN(parsed)) {
				return null;
			}
			return parsed;
		};

		const year = toNumber('year');
		const month = toNumber('month');
		const day = toNumber('day');
		let hour = toNumber('hour');
		const minute = toNumber('minute');

		if (
			year === null ||
			month === null ||
			day === null ||
			hour === null ||
			minute === null
		) {
			return null;
		}

		if (hour === 24) {
			hour = 0;
		}

		return {
			year,
			month,
			day,
			minutes: hour * 60 + minute,
		};
	} catch {
		return null;
	}
};

const formatCountdown = (minutes: number): string => {
	const safeMinutes = Math.max(minutes, 0);
	const hours = Math.floor(safeMinutes / 60);
	const remainingMinutes = safeMinutes % 60;

	if (hours === 0) {
		return `${remainingMinutes}m`;
	}

	return `${hours}h ${remainingMinutes}m`;
};

const getHighlightState = (day: PrayerData): HighlightState | null => {
	const dayParts = parseGregorianDay(day.date.gregorian.date);
	if (!dayParts) {
		return null;
	}

	const seharMinutes = parsePrayerTimeToMinutes(day.timings.Fajr);
	const iftarMinutes = parsePrayerTimeToMinutes(day.timings.Maghrib);
	if (seharMinutes === null || iftarMinutes === null) {
		return null;
	}

	const nowParts = nowInTimezoneParts(day.meta.timezone);
	if (!nowParts) {
		return null;
	}

	const nowDateUtc = Date.UTC(nowParts.year, nowParts.month - 1, nowParts.day);
	const targetDateUtc = Date.UTC(
		dayParts.year,
		dayParts.month - 1,
		dayParts.day
	);
	const dayDiff = Math.floor((targetDateUtc - nowDateUtc) / DAY_MS);

	if (dayDiff > 0) {
		const minutesUntilSehar =
			dayDiff * MINUTES_IN_DAY + (seharMinutes - nowParts.minutes);
		return {
			current: 'Before roza day',
			next: 'First Sehar',
			countdown: formatCountdown(minutesUntilSehar),
		};
	}

	if (dayDiff < 0) {
		return null;
	}

	if (nowParts.minutes < seharMinutes) {
		return {
			current: 'Sehar window open',
			next: 'Roza starts (Fajr)',
			countdown: formatCountdown(seharMinutes - nowParts.minutes),
		};
	}

	if (nowParts.minutes < iftarMinutes) {
		return {
			current: 'Roza in progress',
			next: 'Iftar',
			countdown: formatCountdown(iftarMinutes - nowParts.minutes),
		};
	}

	const minutesUntilNextSehar =
		MINUTES_IN_DAY - nowParts.minutes + seharMinutes;
	return {
		current: 'Iftar time',
		next: 'Next day Sehar',
		countdown: formatCountdown(minutesUntilNextSehar),
	};
};

const getConfiguredFirstRozaDate = (
	opts: RamadanCommandOptions
): Date | null => {
	if (opts.clearFirstRozaDate) {
		clearStoredFirstRozaDate();
		return null;
	}

	if (opts.firstRozaDate) {
		const parsedExplicit = parseIsoDate(opts.firstRozaDate);
		if (!parsedExplicit) {
			throw new Error('Invalid first roza date. Use YYYY-MM-DD.');
		}
		setStoredFirstRozaDate(opts.firstRozaDate);
		return parsedExplicit;
	}

	const storedDate = getStoredFirstRozaDate();
	if (!storedDate) {
		return null;
	}

	const parsedStored = parseIsoDate(storedDate);
	if (parsedStored) {
		return parsedStored;
	}

	clearStoredFirstRozaDate();
	return null;
};

export const getTargetRamadanYear = (today: PrayerData): number => {
	const hijriYear = Number.parseInt(today.date.hijri.year, 10);
	const hijriMonth = today.date.hijri.month.number;
	if (hijriMonth > 9) {
		return hijriYear + 1;
	}
	return hijriYear;
};

const formatRowAnnotation = (kind: RowAnnotationKind): string => {
	if (kind === 'current') {
		return pc.green('← current');
	}

	return pc.yellow('← next');
};

const printTable = (
	rows: ReadonlyArray<RamadanRow>,
	rowAnnotations: Readonly<Record<number, RowAnnotationKind>> = {}
): void => {
	const headers = ['Roza', 'Sehar', 'Iftar', 'Date', 'Hijri'];
	const widths = [6, 8, 8, 14, 20] as const;
	const pad = (value: string, index: number): string =>
		value.padEnd(widths[index] ?? value.length);
	const line = (columns: ReadonlyArray<string>): string =>
		columns.map((column, index) => pad(column, index)).join('  ');
	const divider = '-'.repeat(line(headers).length);

	console.log(pc.dim(`  ${line(headers)}`));
	console.log(pc.dim(`  ${divider}`));
	for (const row of rows) {
		const rowLine = line([
			String(row.roza),
			row.sehar,
			row.iftar,
			row.date,
			row.hijri,
		]);
		const annotation = rowAnnotations[row.roza];
		if (!annotation) {
			console.log(`  ${rowLine}`);
			continue;
		}

		console.log(`  ${rowLine}  ${formatRowAnnotation(annotation)}`);
	}
};

const getErrorMessage = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message;
	}
	return 'unknown error';
};

export const getJsonErrorCode = (message: string): string => {
	if (message.startsWith('Invalid first roza date')) {
		return 'INVALID_FIRST_ROZA_DATE';
	}

	if (message.includes('Use either --all or --number')) {
		return 'INVALID_FLAG_COMBINATION';
	}

	if (message.startsWith('Could not fetch prayer times.')) {
		return 'PRAYER_TIMES_FETCH_FAILED';
	}

	if (message.startsWith('Could not fetch Ramadan calendar.')) {
		return 'RAMADAN_CALENDAR_FETCH_FAILED';
	}

	if (message.startsWith('Could not detect location.')) {
		return 'LOCATION_DETECTION_FAILED';
	}

	if (message.startsWith('Could not find roza')) {
		return 'ROZA_NOT_FOUND';
	}

	if (message === 'unknown error') {
		return 'UNKNOWN_ERROR';
	}

	return 'RAMADAN_CLI_ERROR';
};

export const toJsonErrorPayload = (error: unknown): JsonErrorPayload => {
	const message = getErrorMessage(error);
	return {
		ok: false,
		error: {
			code: getJsonErrorCode(message),
			message,
		},
	};
};

const parseCityCountry = (
	value: string
): Readonly<{ city: string; country: string }> | null => {
	const parts = value
		.split(',')
		.map((part) => part.trim())
		.filter(Boolean);

	if (parts.length < 2) {
		return null;
	}

	const city = normalizeCityAlias(parts[0] ?? '');
	if (!city) {
		return null;
	}

	const country = parts.slice(1).join(', ').trim();
	if (!country) {
		return null;
	}

	return { city, country };
};

const getAddressFromGuess = (guessed: GeoLocation): string =>
	`${guessed.city}, ${guessed.country}`;

const withStoredSettings = (
	query: Omit<RamadanQuery, 'method' | 'school' | 'timezone'>
): RamadanQuery => {
	const settings = getStoredPrayerSettings();
	const withMethodSchool: RamadanQuery = {
		...query,
		method: settings.method,
		school: settings.school,
	};

	if (!settings.timezone) {
		return withMethodSchool;
	}

	return {
		...withMethodSchool,
		timezone: settings.timezone,
	};
};

const withCountryAwareSettings = (
	query: Omit<RamadanQuery, 'method' | 'school' | 'timezone'>,
	country: string,
	cityTimezone?: string
): RamadanQuery => {
	const settings = getStoredPrayerSettings();

	let method = settings.method;
	const recommendedMethod = getRecommendedMethod(country);
	if (
		recommendedMethod !== null &&
		shouldApplyRecommendedMethod(settings.method, recommendedMethod)
	) {
		method = recommendedMethod;
	}

	let school = settings.school;
	const recommendedSchool = getRecommendedSchool(country);
	if (shouldApplyRecommendedSchool(settings.school, recommendedSchool)) {
		school = recommendedSchool;
	}

	const timezone = cityTimezone ?? settings.timezone;
	return {
		...query,
		method,
		school,
		...(timezone ? { timezone } : {}),
	};
};

const getStoredQuery = (): RamadanQuery | null => {
	if (!hasStoredLocation()) {
		return null;
	}

	const location = getStoredLocation();
	if (location.city && location.country) {
		const cityCountryQuery: Omit<
			RamadanQuery,
			'method' | 'school' | 'timezone'
		> = {
			address: `${location.city}, ${location.country}`,
			city: location.city,
			country: location.country,
			...(location.latitude !== undefined
				? { latitude: location.latitude }
				: {}),
			...(location.longitude !== undefined
				? { longitude: location.longitude }
				: {}),
		};

		return withStoredSettings({
			...cityCountryQuery,
		});
	}

	if (location.latitude !== undefined && location.longitude !== undefined) {
		return withStoredSettings({
			address: `${location.latitude}, ${location.longitude}`,
			latitude: location.latitude,
			longitude: location.longitude,
		});
	}

	return null;
};

const resolveQueryFromCityInput = async (
	city: string
): Promise<RamadanQuery> => {
	const normalizedInput = normalizeCityAlias(city);
	const parsed = parseCityCountry(normalizedInput);
	if (parsed) {
		return withCountryAwareSettings(
			{
				address: `${parsed.city}, ${parsed.country}`,
				city: parsed.city,
				country: parsed.country,
			},
			parsed.country
		);
	}

	const guessed = await guessCityCountry(normalizedInput);
	if (!guessed) {
		return withStoredSettings({ address: normalizedInput });
	}

	return withCountryAwareSettings(
		{
			address: `${guessed.city}, ${guessed.country}`,
			city: guessed.city,
			country: guessed.country,
			latitude: guessed.latitude,
			longitude: guessed.longitude,
		},
		guessed.country,
		guessed.timezone
	);
};

interface ResolveQueryOptions {
	readonly city?: string | undefined;
	readonly allowInteractiveSetup: boolean;
}

const resolveQuery = async (
	opts: ResolveQueryOptions
): Promise<RamadanQuery> => {
	const city = opts.city;
	if (city) {
		return await resolveQueryFromCityInput(city);
	}

	const storedQuery = getStoredQuery();
	if (storedQuery) {
		return storedQuery;
	}

	if (opts.allowInteractiveSetup && canPromptInteractively()) {
		const configured = await runFirstRunSetup();
		if (!configured) {
			process.exit(0);
		}

		const configuredQuery = getStoredQuery();
		if (configuredQuery) {
			return configuredQuery;
		}
	}

	const guessed = await guessLocation();
	if (!guessed) {
		throw new Error(
			'Could not detect location. Pass a city like `ramadan-cli "Lahore"`.'
		);
	}

	saveAutoDetectedSetup(guessed);

	return withStoredSettings({
		address: getAddressFromGuess(guessed),
		city: guessed.city,
		country: guessed.country,
		latitude: guessed.latitude,
		longitude: guessed.longitude,
	});
};

const fetchRamadanDay = async (
	query: RamadanQuery,
	date?: Date
): Promise<PrayerData> => {
	const errors: Array<string> = [];
	const addressOptions: {
		readonly address: string;
		method?: number;
		school?: number;
		date?: Date;
	} = {
		address: query.address,
	};

	if (query.method !== undefined) {
		addressOptions.method = query.method;
	}

	if (query.school !== undefined) {
		addressOptions.school = query.school;
	}

	if (date) {
		addressOptions.date = date;
	}

	try {
		return await fetchTimingsByAddress(addressOptions);
	} catch (error) {
		errors.push(`timingsByAddress failed: ${getErrorMessage(error)}`);
	}

	if (query.city && query.country) {
		const cityOptions: {
			readonly city: string;
			readonly country: string;
			method?: number;
			school?: number;
			date?: Date;
		} = {
			city: query.city,
			country: query.country,
		};

		if (query.method !== undefined) {
			cityOptions.method = query.method;
		}

		if (query.school !== undefined) {
			cityOptions.school = query.school;
		}

		if (date) {
			cityOptions.date = date;
		}

		try {
			return await fetchTimingsByCity(cityOptions);
		} catch (error) {
			errors.push(`timingsByCity failed: ${getErrorMessage(error)}`);
		}
	}

	if (query.latitude !== undefined && query.longitude !== undefined) {
		const coordsOptions: {
			readonly latitude: number;
			readonly longitude: number;
			method?: number;
			school?: number;
			timezone?: string;
			date?: Date;
		} = {
			latitude: query.latitude,
			longitude: query.longitude,
		};

		if (query.method !== undefined) {
			coordsOptions.method = query.method;
		}

		if (query.school !== undefined) {
			coordsOptions.school = query.school;
		}

		if (query.timezone) {
			coordsOptions.timezone = query.timezone;
		}

		if (date) {
			coordsOptions.date = date;
		}

		try {
			return await fetchTimingsByCoords(coordsOptions);
		} catch (error) {
			errors.push(`timingsByCoords failed: ${getErrorMessage(error)}`);
		}
	}

	throw new Error(`Could not fetch prayer times. ${errors.join(' | ')}`);
};

const fetchRamadanCalendar = async (
	query: RamadanQuery,
	year: number
): Promise<ReadonlyArray<PrayerData>> => {
	const errors: Array<string> = [];
	const addressOptions: {
		readonly address: string;
		readonly year: number;
		readonly month: number;
		method?: number;
		school?: number;
	} = {
		address: query.address,
		year,
		month: 9,
	};

	if (query.method !== undefined) {
		addressOptions.method = query.method;
	}

	if (query.school !== undefined) {
		addressOptions.school = query.school;
	}

	try {
		return await fetchHijriCalendarByAddress(addressOptions);
	} catch (error) {
		errors.push(`hijriCalendarByAddress failed: ${getErrorMessage(error)}`);
	}

	if (query.city && query.country) {
		const cityOptions: {
			readonly city: string;
			readonly country: string;
			readonly year: number;
			readonly month: number;
			method?: number;
			school?: number;
		} = {
			city: query.city,
			country: query.country,
			year,
			month: 9,
		};

		if (query.method !== undefined) {
			cityOptions.method = query.method;
		}

		if (query.school !== undefined) {
			cityOptions.school = query.school;
		}

		try {
			return await fetchHijriCalendarByCity(cityOptions);
		} catch (error) {
			errors.push(`hijriCalendarByCity failed: ${getErrorMessage(error)}`);
		}
	}

	throw new Error(`Could not fetch Ramadan calendar. ${errors.join(' | ')}`);
};

const fetchCustomRamadanDays = async (
	query: RamadanQuery,
	firstRozaDate: Date
): Promise<ReadonlyArray<PrayerData>> => {
	const totalDays = 30;
	const days = Array.from({ length: totalDays }, (_, index) =>
		addDays(firstRozaDate, index)
	);
	return Promise.all(
		days.map(async (dayDate) => fetchRamadanDay(query, dayDate))
	);
};

const getRowByRozaNumber = (
	days: ReadonlyArray<PrayerData>,
	rozaNumber: number
): RamadanRow => {
	const day = days[rozaNumber - 1];
	if (!day) {
		throw new Error(`Could not find roza ${rozaNumber} timings.`);
	}
	return toRamadanRow(day, rozaNumber);
};

const getDayByRozaNumber = (
	days: ReadonlyArray<PrayerData>,
	rozaNumber: number
): PrayerData => {
	const day = days[rozaNumber - 1];
	if (!day) {
		throw new Error(`Could not find roza ${rozaNumber} timings.`);
	}
	return day;
};

const getHijriYearFromRozaNumber = (
	days: ReadonlyArray<PrayerData>,
	rozaNumber: number,
	fallbackYear: number
): number => {
	const day = days[rozaNumber - 1];
	if (!day) {
		return fallbackYear;
	}
	return Number.parseInt(day.date.hijri.year, 10);
};

const setRowAnnotation = (
	annotations: Record<number, RowAnnotationKind>,
	roza: number,
	kind: RowAnnotationKind
): void => {
	if (roza < 1 || roza > 30) {
		return;
	}

	annotations[roza] = kind;
};

const getAllModeRowAnnotations = (input: {
	readonly today: PrayerData;
	readonly todayGregorianDate: Date;
	readonly targetYear: number;
	readonly configuredFirstRozaDate: Date | null;
}): Readonly<Record<number, RowAnnotationKind>> => {
	const annotations: Record<number, RowAnnotationKind> = {};

	if (input.configuredFirstRozaDate) {
		const currentRoza = getRozaNumberFromStartDate(
			input.configuredFirstRozaDate,
			input.todayGregorianDate
		);

		if (currentRoza < 1) {
			setRowAnnotation(annotations, 1, 'next');
			return annotations;
		}

		setRowAnnotation(annotations, currentRoza, 'current');
		setRowAnnotation(annotations, currentRoza + 1, 'next');
		return annotations;
	}

	const todayHijriYear = Number.parseInt(input.today.date.hijri.year, 10);
	const isRamadanNow =
		input.today.date.hijri.month.number === 9 &&
		todayHijriYear === input.targetYear;
	if (!isRamadanNow) {
		setRowAnnotation(annotations, 1, 'next');
		return annotations;
	}

	const currentRoza = getRozaNumberFromHijriDay(input.today);
	setRowAnnotation(annotations, currentRoza, 'current');
	setRowAnnotation(annotations, currentRoza + 1, 'next');
	return annotations;
};

const printTextOutput = (
	output: RamadanOutput,
	plain: boolean,
	highlight: HighlightState | null,
	rowAnnotations: Readonly<Record<number, RowAnnotationKind>> = {}
): void => {
	const title =
		output.mode === 'all'
			? `Ramadan ${output.hijriYear} (All Days)`
			: output.mode === 'number'
				? `Roza ${output.rows[0]?.roza ?? ''} Sehar/Iftar`
				: 'Today Sehar/Iftar';

	console.log(plain ? 'RAMADAN CLI' : getBanner());
	console.log(ramadanGreen(`  ${title}`));
	console.log(pc.dim(`  📍 ${output.location}`));
	console.log('');
	printTable(output.rows, rowAnnotations);
	console.log('');
	if (highlight) {
		console.log(`  ${ramadanGreen('Status:')} ${pc.white(highlight.current)}`);
		console.log(
			`  ${ramadanGreen('Up next:')} ${pc.white(highlight.next)} in ${pc.yellow(highlight.countdown)}`
		);
		console.log('');
	}
	console.log(pc.dim('  Sehar uses Fajr. Iftar uses Maghrib.'));
	console.log('');
};

const formatStatusLine = (highlight: HighlightState): string => {
	const label = (() => {
		switch (highlight.next) {
			case 'First Sehar':
			case 'Next day Sehar':
				return 'Sehar';
			case 'Roza starts (Fajr)':
				return 'Fast starts';
			default:
				return highlight.next;
		}
	})();
	return `${label} in ${highlight.countdown}`;
};

export const ramadanCommand = async (
	opts: RamadanCommandOptions
): Promise<void> => {
	const isSilent = opts.json || opts.status;
	const spinner = isSilent
		? null
		: ora({
				text: 'Fetching Ramadan timings...',
				stream: process.stdout,
			});

	if (opts.status) {
		try {
			const query = await resolveQuery({
				city: opts.city,
				allowInteractiveSetup: false,
			});
			const today = await fetchRamadanDay(query);
			const highlight = getHighlightState(today);
			if (highlight) {
				console.log(formatStatusLine(highlight));
			}
		} catch {
			// silent failure for status lines
		}
		return;
	}

	try {
		const configuredFirstRozaDate = getConfiguredFirstRozaDate(opts);
		const query = await resolveQuery({
			city: opts.city,
			allowInteractiveSetup: !opts.json,
		});
		spinner?.start();
		const today = await fetchRamadanDay(query);
		const todayGregorianDate = parseGregorianDate(today.date.gregorian.date);
		if (!todayGregorianDate) {
			throw new Error('Could not parse Gregorian date from prayer response.');
		}
		const targetYear = getTargetRamadanYear(today);
		const hasCustomFirstRozaDate = configuredFirstRozaDate !== null;

		if (opts.all && opts.rozaNumber !== undefined) {
			throw new Error('Use either --all or --number, not both.');
		}

		if (opts.rozaNumber !== undefined) {
			let row: RamadanRow;
			let hijriYear = targetYear;
			let selectedDay: PrayerData;

			if (hasCustomFirstRozaDate) {
				const firstRozaDate = configuredFirstRozaDate;
				if (!firstRozaDate) {
					throw new Error('Could not determine first roza date.');
				}
				const customDays = await fetchCustomRamadanDays(query, firstRozaDate);
				row = getRowByRozaNumber(customDays, opts.rozaNumber);
				selectedDay = getDayByRozaNumber(customDays, opts.rozaNumber);
				hijriYear = getHijriYearFromRozaNumber(
					customDays,
					opts.rozaNumber,
					targetYear
				);
			} else {
				const calendar = await fetchRamadanCalendar(query, targetYear);
				row = getRowByRozaNumber(calendar, opts.rozaNumber);
				selectedDay = getDayByRozaNumber(calendar, opts.rozaNumber);
				hijriYear = getHijriYearFromRozaNumber(
					calendar,
					opts.rozaNumber,
					targetYear
				);
			}

			const output: RamadanOutput = {
				mode: 'number',
				location: query.address,
				hijriYear,
				rows: [row],
			};
			spinner?.stop();
			if (opts.json) {
				console.log(JSON.stringify(output, null, 2));
				return;
			}
			printTextOutput(
				output,
				Boolean(opts.plain),
				getHighlightState(selectedDay)
			);
			return;
		}

		if (!opts.all) {
			let row: RamadanRow | null = null;
			let outputHijriYear = targetYear;
			let highlightDay: PrayerData | null = null;

			if (hasCustomFirstRozaDate) {
				const firstRozaDate = configuredFirstRozaDate;
				if (!firstRozaDate) {
					throw new Error('Could not determine first roza date.');
				}
				const rozaNumber = getRozaNumberFromStartDate(
					firstRozaDate,
					todayGregorianDate
				);

				if (rozaNumber < 1) {
					const firstRozaDay = await fetchRamadanDay(query, firstRozaDate);
					row = toRamadanRow(firstRozaDay, 1);
					highlightDay = firstRozaDay;
					outputHijriYear = Number.parseInt(firstRozaDay.date.hijri.year, 10);
				}

				if (rozaNumber >= 1) {
					row = toRamadanRow(today, rozaNumber);
					highlightDay = today;
					outputHijriYear = Number.parseInt(today.date.hijri.year, 10);
				}
			}

			if (!hasCustomFirstRozaDate) {
				const isRamadanNow = today.date.hijri.month.number === 9;
				if (isRamadanNow) {
					row = toRamadanRow(today, getRozaNumberFromHijriDay(today));
					highlightDay = today;
				}

				if (!isRamadanNow) {
					const calendar = await fetchRamadanCalendar(query, targetYear);
					const firstRamadanDay = calendar[0];
					if (!firstRamadanDay) {
						throw new Error('Could not find the first day of Ramadan.');
					}
					row = toRamadanRow(firstRamadanDay, 1);
					highlightDay = firstRamadanDay;
					outputHijriYear = Number.parseInt(
						firstRamadanDay.date.hijri.year,
						10
					);
				}
			}

			if (!row) {
				throw new Error('Could not determine roza number.');
			}

			const output: RamadanOutput = {
				mode: 'today',
				location: query.address,
				hijriYear: outputHijriYear,
				rows: [row],
			};
			spinner?.stop();
			if (opts.json) {
				console.log(JSON.stringify(output, null, 2));
				return;
			}
			printTextOutput(
				output,
				Boolean(opts.plain),
				getHighlightState(highlightDay ?? today)
			);
			return;
		}

		let rows: ReadonlyArray<RamadanRow> = [];
		let hijriYear = targetYear;

		if (hasCustomFirstRozaDate) {
			const firstRozaDate = configuredFirstRozaDate;
			if (!firstRozaDate) {
				throw new Error('Could not determine first roza date.');
			}
			const customDays = await fetchCustomRamadanDays(query, firstRozaDate);
			rows = customDays.map((day, index) => toRamadanRow(day, index + 1));
			const firstCustomDay = customDays[0];
			if (firstCustomDay) {
				hijriYear = Number.parseInt(firstCustomDay.date.hijri.year, 10);
			}
		}

		if (!hasCustomFirstRozaDate) {
			const calendar = await fetchRamadanCalendar(query, targetYear);
			rows = calendar.map((day, index) => toRamadanRow(day, index + 1));
		}

		const output: RamadanOutput = {
			mode: 'all',
			location: query.address,
			hijriYear,
			rows,
		};
		const allModeRowAnnotations = getAllModeRowAnnotations({
			today,
			todayGregorianDate,
			targetYear,
			configuredFirstRozaDate,
		});

		spinner?.stop();
		if (opts.json) {
			console.log(JSON.stringify(output, null, 2));
			return;
		}
		printTextOutput(
			output,
			Boolean(opts.plain),
			getHighlightState(today),
			allModeRowAnnotations
		);
	} catch (error) {
		if (opts.json) {
			process.stderr.write(`${JSON.stringify(toJsonErrorPayload(error))}\n`);
			process.exit(1);
		}

		spinner?.fail(
			error instanceof Error ? error.message : 'Failed to fetch Ramadan timings'
		);
		process.exit(1);
	}
};
