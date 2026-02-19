import * as p from '@clack/prompts';
import { type GeoLocation, guessCityCountry, guessLocation } from './geo.js';
import { type SupportedLang, setLocale, t } from './i18n/index.js';
import {
	setStoredLanguage,
	setStoredLocation,
	setStoredMethod,
	setStoredSchool,
	setStoredTimezone,
} from './ramadan-config.js';
import {
	getRecommendedMethod,
	getRecommendedSchool,
} from './recommendations.js';
import { MOON_EMOJI, ramadanGreen } from './ui/theme.js';

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
		label: `${findMethodLabel(recommendedMethod)} ${t('setupRecommended')}`,
		hint: t('setupBasedOnCountry'),
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
				label: `${t('setupHanafi')} ${t('setupRecommended')}`,
				hint: t('setupLaterAsrTiming'),
			},
			{
				value: SCHOOL_SHAFI,
				label: t('setupShafi'),
				hint: t('setupStandardAsrTiming'),
			},
		];
	}

	return [
		{
			value: SCHOOL_SHAFI,
			label: `${t('setupShafi')} ${t('setupRecommended')}`,
			hint: t('setupStandardAsrTiming'),
		},
		{
			value: SCHOOL_HANAFI,
			label: t('setupHanafi'),
			hint: t('setupLaterAsrTiming'),
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
	Boolean(
		process.stdin.isTTY && process.stdout.isTTY && process.env.CI !== 'true'
	);

const handleCancelledPrompt = (): false => {
	p.cancel(t('setupCancelled'));
	return false;
};

export const runFirstRunSetup = async (): Promise<boolean> => {
	p.intro(ramadanGreen(t('setupIntro')));

	// Language selection prompt (first question)
	const langAnswer = await p.select({
		message: t('setupSelectLanguage'),
		initialValue: 'en' as SupportedLang,
		options: [
			{ value: 'en' as SupportedLang, label: t('langEnglish') },
			{ value: 'id' as SupportedLang, label: t('langIndonesian') },
		],
	});
	if (p.isCancel(langAnswer)) {
		return handleCancelledPrompt();
	}

	const selectedLang = langAnswer as SupportedLang;
	setLocale(selectedLang);
	setStoredLanguage(selectedLang);

	const ipSpinner = p.spinner();
	ipSpinner.start(t('setupDetecting'));
	const ipGuess = await guessLocation();
	ipSpinner.stop(
		ipGuess
			? t('setupDetected', { city: ipGuess.city, country: ipGuess.country })
			: t('setupDetectFailed')
	);

	const cityAnswer = await p.text({
		message: t('setupEnterCity'),
		placeholder: t('setupCityPlaceholder'),
		...(ipGuess?.city
			? {
					defaultValue: ipGuess.city,
					initialValue: ipGuess.city,
				}
			: {}),
		validate: (value) => {
			if (!value.trim()) {
				return t('setupCityRequired');
			}
			return undefined;
		},
	});
	if (p.isCancel(cityAnswer)) {
		return handleCancelledPrompt();
	}

	const city = toNonEmptyString(cityAnswer);
	if (!city) {
		p.log.error(t('setupInvalidCity'));
		return false;
	}

	const countryAnswer = await p.text({
		message: t('setupEnterCountry'),
		placeholder: t('setupCountryPlaceholder'),
		...(ipGuess?.country
			? {
					defaultValue: ipGuess.country,
					initialValue: ipGuess.country,
				}
			: {}),
		validate: (value) => {
			if (!value.trim()) {
				return t('setupCountryRequired');
			}
			return undefined;
		},
	});
	if (p.isCancel(countryAnswer)) {
		return handleCancelledPrompt();
	}

	const country = toNonEmptyString(countryAnswer);
	if (!country) {
		p.log.error(t('setupInvalidCountry'));
		return false;
	}

	const detailsSpinner = p.spinner();
	detailsSpinner.start(t('setupResolvingCity'));
	const detectedDetails = await resolveDetectedDetails(city, country, ipGuess);
	detailsSpinner.stop(
		detectedDetails.timezone
			? t('setupDetectedTimezone', { timezone: detectedDetails.timezone })
			: t('setupTimezoneDetectFailed')
	);

	const recommendedMethod = getRecommendedMethod(country);
	const methodAnswer = await p.select({
		message: t('setupSelectMethod'),
		initialValue: recommendedMethod ?? DEFAULT_METHOD,
		options: [...getMethodOptions(recommendedMethod)],
	});
	if (p.isCancel(methodAnswer)) {
		return handleCancelledPrompt();
	}

	const method = toNumberSelection(methodAnswer);
	if (method === null) {
		p.log.error(t('setupInvalidMethod'));
		return false;
	}

	const recommendedSchool = getRecommendedSchool(country);
	const schoolAnswer = await p.select({
		message: t('setupSelectSchool'),
		initialValue: recommendedSchool,
		options: [...getSchoolOptions(recommendedSchool)],
	});
	if (p.isCancel(schoolAnswer)) {
		return handleCancelledPrompt();
	}

	const school = toNumberSelection(schoolAnswer);
	if (school === null) {
		p.log.error(t('setupInvalidSchool'));
		return false;
	}

	const hasDetectedTimezone = Boolean(detectedDetails.timezone);
	const timezoneOptions: ReadonlyArray<SelectOption<TimezoneChoice>> =
		hasDetectedTimezone
			? [
					{
						value: 'detected',
						label: t('setupUseDetectedTimezone', {
							timezone: detectedDetails.timezone ?? '',
						}),
					},
					{ value: 'custom', label: t('setupSetCustomTimezone') },
					{ value: 'skip', label: t('setupSkipTimezone') },
				]
			: [
					{ value: 'custom', label: t('setupSetCustomTimezone') },
					{ value: 'skip', label: t('setupSkipTimezone') },
				];

	const timezoneAnswer = await p.select({
		message: t('setupTimezonePreference'),
		initialValue: hasDetectedTimezone ? 'detected' : 'skip',
		options: [...timezoneOptions],
	});
	if (p.isCancel(timezoneAnswer)) {
		return handleCancelledPrompt();
	}

	const timezoneChoice = toTimezoneChoice(timezoneAnswer, hasDetectedTimezone);
	if (!timezoneChoice) {
		p.log.error(t('setupInvalidTimezone'));
		return false;
	}

	let timezone =
		timezoneChoice === 'detected' ? detectedDetails.timezone : undefined;

	if (timezoneChoice === 'custom') {
		const timezoneInput = await p.text({
			message: t('setupEnterTimezone'),
			placeholder: detectedDetails.timezone ?? t('setupTimezonePlaceholder'),
			...(detectedDetails.timezone
				? {
						defaultValue: detectedDetails.timezone,
						initialValue: detectedDetails.timezone,
					}
				: {}),
			validate: (value) => {
				if (!value.trim()) {
					return t('setupTimezoneRequired');
				}
				return undefined;
			},
		});
		if (p.isCancel(timezoneInput)) {
			return handleCancelledPrompt();
		}

		const customTimezone = toNonEmptyString(timezoneInput);
		if (!customTimezone) {
			p.log.error(t('setupInvalidTimezone'));
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

	p.outro(ramadanGreen(t('setupComplete')));
	return true;
};
