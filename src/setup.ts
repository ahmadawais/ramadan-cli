import * as p from '@clack/prompts';
import pc from 'picocolors';
import {
	guessCityCountry,
	guessLocation,
	type GeoLocation,
} from './geo.js';
import {
	setStoredLocation,
	setStoredMethod,
	setStoredSchool,
	setStoredTimezone,
} from './ramadan-config.js';
import { getRecommendedMethod, getRecommendedSchool } from './recommendations.js';

interface SelectOption<TValue> {
	readonly value: TValue;
	readonly label: string;
	readonly hint?: string;
}

type TimezoneChoice = 'detected' | 'custom' | 'skip';

const METHOD_OPTIONS: ReadonlyArray<SelectOption<number>> = [
	{ value: 0, label: 'Jafari (Shia Ithna-Ashari)' },
	{ value: 1, label: 'Karachi (Pakistan)' },
	{ value: 2, label: 'ISNA (North America)' },
	{ value: 3, label: 'MWL (Muslim World League)' },
	{ value: 4, label: 'Makkah (Umm al-Qura)' },
	{ value: 5, label: 'Egypt' },
	{ value: 7, label: 'Tehran (Shia)' },
	{ value: 8, label: 'Gulf Region' },
	{ value: 9, label: 'Kuwait' },
	{ value: 10, label: 'Qatar' },
	{ value: 11, label: 'Singapore' },
	{ value: 12, label: 'France' },
	{ value: 13, label: 'Turkey' },
	{ value: 14, label: 'Russia' },
	{ value: 15, label: 'Moonsighting Committee' },
	{ value: 16, label: 'Dubai' },
	{ value: 17, label: 'Malaysia (JAKIM)' },
	{ value: 18, label: 'Tunisia' },
	{ value: 19, label: 'Algeria' },
	{ value: 20, label: 'Indonesia' },
	{ value: 21, label: 'Morocco' },
	{ value: 22, label: 'Portugal' },
	{ value: 23, label: 'Jordan' },
];

const SCHOOL_SHAFI = 0;
const SCHOOL_HANAFI = 1;
const DEFAULT_METHOD = 2;

const normalize = (value: string): string => value.trim().toLowerCase();

const toNonEmptyString = (value: unknown): string | null => {
	if (typeof value !== 'string') {
		return null;
	}

	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}

	return trimmed;
};

const toNumberSelection = (value: unknown): number | null => {
	if (typeof value !== 'number') {
		return null;
	}
	return value;
};

const toTimezoneChoice = (
	value: unknown,
	hasDetectedOption: boolean
): TimezoneChoice | null => {
	if (value === 'custom') {
		return 'custom';
	}

	if (value === 'skip') {
		return 'skip';
	}

	if (hasDetectedOption && value === 'detected') {
		return 'detected';
	}

	return null;
};

const findMethodLabel = (method: number): string => {
	const option = METHOD_OPTIONS.find((entry) => entry.value === method);
	if (option) {
		return option.label;
	}

	return `Method ${method}`;
};

export const getMethodOptions = (
	recommendedMethod: number | null
): ReadonlyArray<SelectOption<number>> => {
	if (recommendedMethod === null) {
		return METHOD_OPTIONS;
	}

	const recommendedOption: SelectOption<number> = {
		value: recommendedMethod,
		label: `${findMethodLabel(recommendedMethod)} (Recommended)`,
		hint: 'Based on your country',
	};
	const remaining = METHOD_OPTIONS.filter(
		(option) => option.value !== recommendedMethod
	);
	return [recommendedOption, ...remaining];
};

export const getSchoolOptions = (
	recommendedSchool: number
): ReadonlyArray<SelectOption<number>> => {
	if (recommendedSchool === SCHOOL_HANAFI) {
		return [
			{
				value: SCHOOL_HANAFI,
				label: 'Hanafi (Recommended)',
				hint: 'Later Asr timing',
			},
			{
				value: SCHOOL_SHAFI,
				label: 'Shafi',
				hint: 'Standard Asr timing',
			},
		];
	}

	return [
		{
			value: SCHOOL_SHAFI,
			label: 'Shafi (Recommended)',
			hint: 'Standard Asr timing',
		},
		{
			value: SCHOOL_HANAFI,
			label: 'Hanafi',
			hint: 'Later Asr timing',
		},
	];
};

const cityCountryMatchesGuess = (
	city: string,
	country: string,
	guess: GeoLocation
): boolean =>
	normalize(city) === normalize(guess.city) &&
	normalize(country) === normalize(guess.country);

const resolveDetectedDetails = async (
	city: string,
	country: string,
	ipGuess: GeoLocation | null
): Promise<
	Readonly<{
		latitude?: number | undefined;
		longitude?: number | undefined;
		timezone?: string | undefined;
	}>
> => {
	const geocoded = await guessCityCountry(`${city}, ${country}`);
	if (geocoded) {
		return {
			latitude: geocoded.latitude,
			longitude: geocoded.longitude,
			timezone: geocoded.timezone,
		};
	}

	if (!ipGuess) {
		return {};
	}

	if (!cityCountryMatchesGuess(city, country, ipGuess)) {
		return {};
	}

	return {
		latitude: ipGuess.latitude,
		longitude: ipGuess.longitude,
		timezone: ipGuess.timezone,
	};
};

export const canPromptInteractively = (): boolean =>
	Boolean(process.stdin.isTTY && process.stdout.isTTY && process.env.CI !== 'true');

const handleCancelledPrompt = (): false => {
	p.cancel('Setup cancelled');
	return false;
};

export const runFirstRunSetup = async (): Promise<boolean> => {
	p.intro(pc.white('Ramadan CLI Setup'));

	const ipSpinner = p.spinner();
	ipSpinner.start('Detecting your location...');
	const ipGuess = await guessLocation();
	ipSpinner.stop(
		ipGuess
			? `Detected: ${ipGuess.city}, ${ipGuess.country}`
			: 'Could not detect location'
	);

	const cityAnswer = await p.text({
		message: 'Enter your city',
		placeholder: 'e.g., Lahore',
		...(ipGuess?.city
			? {
					defaultValue: ipGuess.city,
					initialValue: ipGuess.city,
				}
			: {}),
		validate: (value) => {
			if (!value.trim()) {
				return 'City is required.';
			}
			return undefined;
		},
	});
	if (p.isCancel(cityAnswer)) {
		return handleCancelledPrompt();
	}

	const city = toNonEmptyString(cityAnswer);
	if (!city) {
		p.log.error('Invalid city value.');
		return false;
	}

	const countryAnswer = await p.text({
		message: 'Enter your country',
		placeholder: 'e.g., Pakistan',
		...(ipGuess?.country
			? {
					defaultValue: ipGuess.country,
					initialValue: ipGuess.country,
				}
			: {}),
		validate: (value) => {
			if (!value.trim()) {
				return 'Country is required.';
			}
			return undefined;
		},
	});
	if (p.isCancel(countryAnswer)) {
		return handleCancelledPrompt();
	}

	const country = toNonEmptyString(countryAnswer);
	if (!country) {
		p.log.error('Invalid country value.');
		return false;
	}

	const detailsSpinner = p.spinner();
	detailsSpinner.start('Resolving city details...');
	const detectedDetails = await resolveDetectedDetails(city, country, ipGuess);
	detailsSpinner.stop(
		detectedDetails.timezone
			? `Detected timezone: ${detectedDetails.timezone}`
			: 'Could not detect timezone for this city'
	);

	const recommendedMethod = getRecommendedMethod(country);
	const methodAnswer = await p.select({
		message: 'Select calculation method',
		initialValue: recommendedMethod ?? DEFAULT_METHOD,
		options: [...getMethodOptions(recommendedMethod)],
	});
	if (p.isCancel(methodAnswer)) {
		return handleCancelledPrompt();
	}

	const method = toNumberSelection(methodAnswer);
	if (method === null) {
		p.log.error('Invalid method selection.');
		return false;
	}

	const recommendedSchool = getRecommendedSchool(country);
	const schoolAnswer = await p.select({
		message: 'Select Asr school',
		initialValue: recommendedSchool,
		options: [...getSchoolOptions(recommendedSchool)],
	});
	if (p.isCancel(schoolAnswer)) {
		return handleCancelledPrompt();
	}

	const school = toNumberSelection(schoolAnswer);
	if (school === null) {
		p.log.error('Invalid school selection.');
		return false;
	}

	const hasDetectedTimezone = Boolean(detectedDetails.timezone);
	const timezoneOptions: ReadonlyArray<SelectOption<TimezoneChoice>> =
		hasDetectedTimezone
			? [
					{
						value: 'detected',
						label: `Use detected timezone (${detectedDetails.timezone ?? ''})`,
					},
					{ value: 'custom', label: 'Set custom timezone' },
					{ value: 'skip', label: 'Do not set timezone override' },
				]
			: [
					{ value: 'custom', label: 'Set custom timezone' },
					{ value: 'skip', label: 'Do not set timezone override' },
				];

	const timezoneAnswer = await p.select({
		message: 'Timezone preference',
		initialValue: hasDetectedTimezone ? 'detected' : 'skip',
		options: [...timezoneOptions],
	});
	if (p.isCancel(timezoneAnswer)) {
		return handleCancelledPrompt();
	}

	const timezoneChoice = toTimezoneChoice(timezoneAnswer, hasDetectedTimezone);
	if (!timezoneChoice) {
		p.log.error('Invalid timezone selection.');
		return false;
	}

	let timezone = timezoneChoice === 'detected' ? detectedDetails.timezone : undefined;

	if (timezoneChoice === 'custom') {
		const timezoneInput = await p.text({
			message: 'Enter timezone',
			placeholder: detectedDetails.timezone ?? 'e.g., Asia/Karachi',
			...(detectedDetails.timezone
				? {
						defaultValue: detectedDetails.timezone,
						initialValue: detectedDetails.timezone,
					}
				: {}),
			validate: (value) => {
				if (!value.trim()) {
					return 'Timezone is required.';
				}
				return undefined;
			},
		});
		if (p.isCancel(timezoneInput)) {
			return handleCancelledPrompt();
		}

		const customTimezone = toNonEmptyString(timezoneInput);
		if (!customTimezone) {
			p.log.error('Invalid timezone value.');
			return false;
		}
		timezone = customTimezone;
	}

	setStoredLocation({
		city,
		country,
		...(detectedDetails.latitude !== undefined
			? { latitude: detectedDetails.latitude }
			: {}),
		...(detectedDetails.longitude !== undefined
			? { longitude: detectedDetails.longitude }
			: {}),
	});
	setStoredMethod(method);
	setStoredSchool(school);
	setStoredTimezone(timezone);

	p.outro(pc.green('Setup complete.'));
	return true;
};
