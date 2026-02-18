import pc from 'picocolors';
import { z } from 'zod';
import {
	clearRamadanConfig,
	getStoredFirstRozaDate,
	getStoredLocation,
	getStoredPrayerSettings,
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
		? { latitude: parseOptionalWithSchema(options.latitude, LatitudeSchema, 'latitude') }
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
		? { method: parseOptionalWithSchema(options.method, MethodSchema, 'method') }
		: {}),
	...(options.school !== undefined
		? { school: parseOptionalWithSchema(options.school, SchoolSchema, 'school') }
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

	console.log(pc.dim('Current configuration:'));
	if (location.city) {
		console.log(`  City: ${location.city}`);
	}
	if (location.country) {
		console.log(`  Country: ${location.country}`);
	}
	if (location.latitude !== undefined) {
		console.log(`  Latitude: ${location.latitude}`);
	}
	if (location.longitude !== undefined) {
		console.log(`  Longitude: ${location.longitude}`);
	}
	console.log(`  Method: ${settings.method}`);
	console.log(`  School: ${settings.school}`);
	if (settings.timezone) {
		console.log(`  Timezone: ${settings.timezone}`);
	}
	if (firstRozaDate) {
		console.log(`  First Roza Date: ${firstRozaDate}`);
	}
};

const hasConfigUpdateFlags = (options: ConfigCommandOptions): boolean =>
	Boolean(
		options.city ||
			options.country ||
			options.latitude !== undefined ||
			options.longitude !== undefined ||
			options.method !== undefined ||
			options.school !== undefined ||
			options.timezone
	);

export const configCommand = async (
	options: ConfigCommandOptions
): Promise<void> => {
	if (options.clear) {
		clearRamadanConfig();
		console.log(pc.green('Configuration cleared.'));
		return;
	}

	if (options.show) {
		printCurrentConfig();
		return;
	}

	if (!hasConfigUpdateFlags(options)) {
		console.log(
			pc.dim('No config updates provided. Use `ramadan-cli config --show` to inspect.')
		);
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

	console.log(pc.green('Configuration updated.'));
};
