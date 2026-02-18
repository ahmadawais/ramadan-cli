import Conf from 'conf';
import { z } from 'zod';
import type { GeoLocation } from './geo.js';
import {
	getRecommendedMethod,
	getRecommendedSchool,
} from './recommendations.js';

interface RamadanConfigStore {
	readonly latitude?: number | undefined;
	readonly longitude?: number | undefined;
	readonly city?: string | undefined;
	readonly country?: string | undefined;
	readonly method?: number | undefined;
	readonly school?: number | undefined;
	readonly timezone?: string | undefined;
	readonly firstRozaDate?: string | undefined;
	readonly format24h?: boolean | undefined;
}

interface StoredLocation {
	readonly city?: string | undefined;
	readonly country?: string | undefined;
	readonly latitude?: number | undefined;
	readonly longitude?: number | undefined;
}

interface StoredPrayerSettings {
	readonly method: number;
	readonly school: number;
	readonly timezone?: string | undefined;
}

const SharedConfigSchema = z.object({
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	city: z.string().optional(),
	country: z.string().optional(),
	method: z.number().optional(),
	school: z.number().optional(),
	timezone: z.string().optional(),
	firstRozaDate: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	format24h: z.boolean().optional(),
});

const IsoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const DEFAULT_METHOD = 2;
const DEFAULT_SCHOOL = 0;

const getConfigCwd = (): string | undefined => {
	const configuredPath = process.env.RAMADAN_CLI_CONFIG_DIR;
	if (configuredPath) {
		return configuredPath;
	}

	const isTestRuntime =
		process.env.VITEST === 'true' || process.env.NODE_ENV === 'test';
	if (isTestRuntime) {
		return '/tmp';
	}

	return undefined;
};

export const shouldApplyRecommendedMethod = (
	currentMethod: number,
	recommendedMethod: number
): boolean =>
	currentMethod === DEFAULT_METHOD || currentMethod === recommendedMethod;

export const shouldApplyRecommendedSchool = (
	currentSchool: number,
	recommendedSchool: number
): boolean =>
	currentSchool === DEFAULT_SCHOOL || currentSchool === recommendedSchool;

const configCwd = getConfigCwd();

const sharedConfig = new Conf<RamadanConfigStore>({
	projectName: 'ramadan-cli',
	...(configCwd ? { cwd: configCwd } : {}),
	defaults: {
		method: DEFAULT_METHOD,
		school: DEFAULT_SCHOOL,
		format24h: false,
	},
});

const legacyAzaanConfig = new Conf<Record<string, unknown>>({
	projectName: 'azaan',
	...(configCwd ? { cwd: configCwd } : {}),
});

const getValidatedStore = (): RamadanConfigStore => {
	const parsed = SharedConfigSchema.safeParse(sharedConfig.store as unknown);
	if (!parsed.success) {
		return {
			method: DEFAULT_METHOD,
			school: DEFAULT_SCHOOL,
			format24h: false,
		};
	}
	return parsed.data;
};

export const getStoredLocation = (): StoredLocation => {
	const store = getValidatedStore();
	return {
		city: store.city,
		country: store.country,
		latitude: store.latitude,
		longitude: store.longitude,
	};
};

export const hasStoredLocation = (): boolean => {
	const location = getStoredLocation();
	const hasCityCountry = Boolean(location.city && location.country);
	const hasCoords = Boolean(
		location.latitude !== undefined && location.longitude !== undefined
	);
	return hasCityCountry || hasCoords;
};

export const getStoredPrayerSettings = (): StoredPrayerSettings => {
	const store = getValidatedStore();
	return {
		method: store.method ?? DEFAULT_METHOD,
		school: store.school ?? DEFAULT_SCHOOL,
		timezone: store.timezone,
	};
};

export const setStoredLocation = (location: StoredLocation): void => {
	if (location.city) {
		sharedConfig.set('city', location.city);
	}

	if (location.country) {
		sharedConfig.set('country', location.country);
	}

	if (location.latitude !== undefined) {
		sharedConfig.set('latitude', location.latitude);
	}

	if (location.longitude !== undefined) {
		sharedConfig.set('longitude', location.longitude);
	}
};

export const setStoredTimezone = (timezone?: string): void => {
	if (!timezone) {
		return;
	}
	sharedConfig.set('timezone', timezone);
};

export const setStoredMethod = (method: number): void => {
	sharedConfig.set('method', method);
};

export const setStoredSchool = (school: number): void => {
	sharedConfig.set('school', school);
};

export const getStoredFirstRozaDate = (): string | undefined => {
	const store = getValidatedStore();
	return store.firstRozaDate;
};

export const setStoredFirstRozaDate = (firstRozaDate: string): void => {
	const parsed = IsoDateSchema.safeParse(firstRozaDate);
	if (!parsed.success) {
		throw new Error('Invalid first roza date. Use YYYY-MM-DD.');
	}
	sharedConfig.set('firstRozaDate', parsed.data);
};

export const clearStoredFirstRozaDate = (): void => {
	sharedConfig.delete('firstRozaDate');
};

export const clearRamadanConfig = (): void => {
	sharedConfig.clear();
	legacyAzaanConfig.clear();
};

const maybeSetRecommendedMethod = (country: string): void => {
	const recommendedMethod = getRecommendedMethod(country);
	if (recommendedMethod === null) {
		return;
	}

	const currentMethod = sharedConfig.get('method') ?? DEFAULT_METHOD;
	if (!shouldApplyRecommendedMethod(currentMethod, recommendedMethod)) {
		return;
	}

	sharedConfig.set('method', recommendedMethod);
};

const maybeSetRecommendedSchool = (country: string): void => {
	const currentSchool = sharedConfig.get('school') ?? DEFAULT_SCHOOL;
	const recommendedSchool = getRecommendedSchool(country);
	if (!shouldApplyRecommendedSchool(currentSchool, recommendedSchool)) {
		return;
	}

	sharedConfig.set('school', recommendedSchool);
};

export const saveAutoDetectedSetup = (location: GeoLocation): void => {
	setStoredLocation({
		city: location.city,
		country: location.country,
		latitude: location.latitude,
		longitude: location.longitude,
	});
	setStoredTimezone(location.timezone);
	maybeSetRecommendedMethod(location.country);
	maybeSetRecommendedSchool(location.country);
};

export const applyRecommendedSettingsIfUnset = (country: string): void => {
	maybeSetRecommendedMethod(country);
	maybeSetRecommendedSchool(country);
};
