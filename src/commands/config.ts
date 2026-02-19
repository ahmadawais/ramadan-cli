import pc from 'picocolors';
import { z } from 'zod';
import { isSupportedLang, setLocale, t } from '../i18n/index.js';
import {
	clearRamadanConfig,
	getStoredFirstRozaDate,
	getStoredLanguage,
	getStoredLocation,
	getStoredPrayerSettings,
	setStoredLanguage,
	setStoredLocation,
	setStoredMethod,
	setStoredSchool,
	setStoredTimezone,
} from '../ramadan-config.js';

export interface ConfigCommandOptions {
	readonly city?: string | undefined;
	readonly country?: string | undefined;
	readonly latitude?: string | undefined;
	readonly longitude?: string | undefined;
	readonly method?: string | undefined;
	readonly school?: string | undefined;
	readonly timezone?: string | undefined;
	readonly lang?: string | undefined;
	readonly show?: boolean | undefined;
	readonly clear?: boolean | undefined;
}

interface ParsedConfigUpdates {
	readonly city?: string | undefined;
	readonly country?: string | undefined;
	readonly latitude?: number | undefined;
	readonly longitude?: number | undefined;
	readonly method?: number | undefined;
	readonly school?: number | undefined;
	readonly timezone?: string | undefined;
}

const MethodSchema = z.coerce.number().int().min(0).max(23);
const SchoolSchema = z.coerce.number().int().min(0).max(1);
const LatitudeSchema = z.coerce.number().min(-90).max(90);
const LongitudeSchema = z.coerce.number().min(-180).max(180);

const parseOptionalWithSchema = <T>(
	value: string | undefined,
	schema: z.ZodType<T>,
	label: string
): T | undefined => {
	if (value === undefined) {
		return undefined;
	}

	const parsed = schema.safeParse(value);
	if (!parsed.success) {
		throw new Error(`Invalid ${label}.`);
	}

	return parsed.data;
};

export const parseConfigUpdates = (
	options: ConfigCommandOptions
): ParsedConfigUpdates => ({
	...(options.city ? { city: options.city.trim() } : {}),
	...(options.country ? { country: options.country.trim() } : {}),
	...(options.latitude !== undefined
		? {
				latitude: parseOptionalWithSchema(
					options.latitude,
					LatitudeSchema,
					'latitude'
				),
			}
		: {}),
	...(options.longitude !== undefined
		? {
				longitude: parseOptionalWithSchema(
					options.longitude,
					LongitudeSchema,
					'longitude'
				),
			}
		: {}),
	...(options.method !== undefined
		? {
				method: parseOptionalWithSchema(options.method, MethodSchema, 'method'),
			}
		: {}),
	...(options.school !== undefined
		? {
				school: parseOptionalWithSchema(options.school, SchoolSchema, 'school'),
			}
		: {}),
	...(options.timezone ? { timezone: options.timezone.trim() } : {}),
});

export const mergeLocationUpdates = (
	current: ReturnType<typeof getStoredLocation>,
	updates: ParsedConfigUpdates
): ReturnType<typeof getStoredLocation> => ({
	...(updates.city !== undefined
		? { city: updates.city }
		: current.city
			? { city: current.city }
			: {}),
	...(updates.country !== undefined
		? { country: updates.country }
		: current.country
			? { country: current.country }
			: {}),
	...(updates.latitude !== undefined
		? { latitude: updates.latitude }
		: current.latitude !== undefined
			? { latitude: current.latitude }
			: {}),
	...(updates.longitude !== undefined
		? { longitude: updates.longitude }
		: current.longitude !== undefined
			? { longitude: current.longitude }
			: {}),
});

const printCurrentConfig = (): void => {
	const location = getStoredLocation();
	const settings = getStoredPrayerSettings();
	const firstRozaDate = getStoredFirstRozaDate();
	const language = getStoredLanguage();

	console.log(pc.dim(t('configCurrentTitle')));
	if (location.city) {
		console.log(`  ${t('configLabelCity')}: ${location.city}`);
	}
	if (location.country) {
		console.log(`  ${t('configLabelCountry')}: ${location.country}`);
	}
	if (location.latitude !== undefined) {
		console.log(`  ${t('configLabelLatitude')}: ${location.latitude}`);
	}
	if (location.longitude !== undefined) {
		console.log(`  ${t('configLabelLongitude')}: ${location.longitude}`);
	}
	console.log(`  ${t('configLabelMethod')}: ${settings.method}`);
	console.log(`  ${t('configLabelSchool')}: ${settings.school}`);
	if (settings.timezone) {
		console.log(`  ${t('configLabelTimezone')}: ${settings.timezone}`);
	}
	if (firstRozaDate) {
		console.log(`  ${t('configLabelFirstRozaDate')}: ${firstRozaDate}`);
	}
	console.log(`  ${t('configLabelLanguage')}: ${language}`);
};

const hasConfigUpdateFlags = (options: ConfigCommandOptions): boolean =>
	Boolean(
		options.city ||
			options.country ||
			options.latitude !== undefined ||
			options.longitude !== undefined ||
			options.method !== undefined ||
			options.school !== undefined ||
			options.timezone ||
			options.lang
	);

export const configCommand = async (
	options: ConfigCommandOptions
): Promise<void> => {
	if (options.clear) {
		clearRamadanConfig();
		console.log(pc.green(t('configCleared')));
		return;
	}

	if (options.show) {
		printCurrentConfig();
		return;
	}

	if (!hasConfigUpdateFlags(options)) {
		console.log(pc.dim(t('configNoUpdates')));
		return;
	}

	const updates = parseConfigUpdates(options);
	const currentLocation = getStoredLocation();
	const nextLocation = mergeLocationUpdates(currentLocation, updates);
	setStoredLocation(nextLocation);

	if (updates.method !== undefined) {
		setStoredMethod(updates.method);
	}

	if (updates.school !== undefined) {
		setStoredSchool(updates.school);
	}

	if (updates.timezone) {
		setStoredTimezone(updates.timezone);
	}

	if (options.lang) {
		const langValue = options.lang.trim().toLowerCase();
		if (isSupportedLang(langValue)) {
			setStoredLanguage(langValue);
			setLocale(langValue);
		}
	}

	console.log(pc.green(t('configUpdated')));
};
