const en = {
	// CLI descriptions
	cliDescription: 'Ramadan CLI for Sehar and Iftar timings',
	cliCityArg: 'City name (e.g. "San Francisco", "sf", "Vancouver", "Lahore")',
	cliCityOption: 'City',
	cliAllOption: 'Show complete Ramadan month',
	cliNumberOption: 'Show a specific roza day (1-30)',
	cliPlainOption: 'Plain text output',
	cliJsonOption: 'JSON output',
	cliStatusOption: 'Status line output (next event only, for status bars)',
	cliFirstRozaDateOption: 'Set and use a custom first roza date',
	cliClearFirstRozaDateOption:
		'Clear custom first roza date and use API Ramadan date',
	cliLangOption: 'Set display language (en, id)',
	cliResetDescription: 'Clear saved Ramadan CLI configuration',
	cliConfigDescription:
		'Configure saved Ramadan CLI settings (non-interactive)',
	cliConfigCityOption: 'Save city',
	cliConfigCountryOption: 'Save country',
	cliConfigLatitudeOption: 'Save latitude (-90 to 90)',
	cliConfigLongitudeOption: 'Save longitude (-180 to 180)',
	cliConfigMethodOption: 'Save calculation method (0-23)',
	cliConfigSchoolOption: 'Save school (0=Shafi, 1=Hanafi)',
	cliConfigTimezoneOption: 'Save timezone (e.g., America/Los_Angeles)',
	cliConfigLangOption: 'Save display language (en, id)',
	cliConfigShowOption: 'Show current configuration',
	cliConfigClearOption: 'Clear saved configuration',
	cliRozaNumberError: 'Roza number must be between 1 and 30.',

	// Setup prompts
	setupIntro: '🌙 Ramadan CLI Setup',
	setupDetecting: '🌙 Detecting your location...',
	setupDetected: 'Detected: {city}, {country}',
	setupDetectFailed: 'Could not detect location',
	setupEnterCity: 'Enter your city',
	setupCityPlaceholder: 'e.g., Lahore',
	setupCityRequired: 'City is required.',
	setupInvalidCity: 'Invalid city value.',
	setupEnterCountry: 'Enter your country',
	setupCountryPlaceholder: 'e.g., Pakistan',
	setupCountryRequired: 'Country is required.',
	setupInvalidCountry: 'Invalid country value.',
	setupResolvingCity: '🌙 Resolving city details...',
	setupDetectedTimezone: 'Detected timezone: {timezone}',
	setupTimezoneDetectFailed: 'Could not detect timezone for this city',
	setupSelectMethod: 'Select calculation method',
	setupInvalidMethod: 'Invalid method selection.',
	setupSelectSchool: 'Select Asr school',
	setupInvalidSchool: 'Invalid school selection.',
	setupTimezonePreference: 'Timezone preference',
	setupUseDetectedTimezone: 'Use detected timezone ({timezone})',
	setupSetCustomTimezone: 'Set custom timezone',
	setupSkipTimezone: 'Do not set timezone override',
	setupEnterTimezone: 'Enter timezone',
	setupTimezonePlaceholder: 'e.g., Asia/Karachi',
	setupTimezoneRequired: 'Timezone is required.',
	setupInvalidTimezone: 'Invalid timezone value.',
	setupComplete: '🌙 Setup complete.',
	setupCancelled: 'Setup cancelled',
	setupSelectLanguage: 'Select display language',

	// Setup - method/school labels
	setupRecommended: '(Recommended)',
	setupBasedOnCountry: 'Based on your country',
	setupHanafi: 'Hanafi',
	setupShafi: 'Shafi',
	setupLaterAsrTiming: 'Later Asr timing',
	setupStandardAsrTiming: 'Standard Asr timing',

	// Table headers
	tableHeaderRoza: 'Roza',
	tableHeaderSehar: 'Sehar',
	tableHeaderIftar: 'Iftar',
	tableHeaderDate: 'Date',
	tableHeaderHijri: 'Hijri',

	// Highlight / status labels
	highlightBeforeRozaDay: 'Before roza day',
	highlightFirstSehar: 'First Sehar',
	highlightSeharWindowOpen: 'Sehar window open',
	highlightRozaStartsFajr: 'Roza starts (Fajr)',
	highlightRozaInProgress: 'Roza in progress',
	highlightIftar: 'Iftar',
	highlightIftarTime: 'Iftar time',
	highlightNextDaySehar: 'Next day Sehar',

	// Row annotations
	annotationCurrent: '← current',
	annotationNext: '← next',

	// Status line labels
	statusSehar: 'Sehar',
	statusFastStarts: 'Fast starts',
	statusIn: 'in',

	// Output titles
	titleAllDays: 'Ramadan {year} (All Days)',
	titleRozaSeharIftar: 'Roza {roza} Sehar/Iftar',
	titleTodaySeharIftar: 'Today Sehar/Iftar',

	// Output labels
	outputStatus: 'Status:',
	outputUpNext: 'Up next:',
	outputIn: 'in',
	outputFooter: 'Sehar uses Fajr. Iftar uses Maghrib.',

	// Banner
	bannerLabel: '🌙 Ramadan CLI',
	bannerTagline: 'Sehar • Iftar • Ramadan timings',

	// Spinner
	spinnerFetching: 'Fetching Ramadan timings...',
	spinnerFailed: 'Failed to fetch Ramadan timings',

	// Config command
	configCleared: 'Configuration cleared.',
	configUpdated: 'Configuration updated.',
	configNoUpdates:
		'No config updates provided. Use `ramadan-cli config --show` to inspect.',
	configCurrentTitle: 'Current configuration:',
	configReset: 'Configuration reset.',

	// Config labels
	configLabelCity: 'City',
	configLabelCountry: 'Country',
	configLabelLatitude: 'Latitude',
	configLabelLongitude: 'Longitude',
	configLabelMethod: 'Method',
	configLabelSchool: 'School',
	configLabelTimezone: 'Timezone',
	configLabelFirstRozaDate: 'First Roza Date',
	configLabelLanguage: 'Language',

	// Errors
	errorInvalidFirstRozaDate: 'Invalid first roza date. Use YYYY-MM-DD.',
	errorUseAllOrNumber: 'Use either --all or --number, not both.',
	errorCouldNotFetchPrayer: 'Could not fetch prayer times. {details}',
	errorCouldNotFetchCalendar: 'Could not fetch Ramadan calendar. {details}',
	errorCouldNotDetectLocation:
		'Could not detect location. Pass a city like `ramadan-cli "Lahore"`.',
	errorCouldNotFindRoza: 'Could not find roza {number} timings.',
	errorCouldNotParseDate:
		'Could not parse Gregorian date from prayer response.',
	errorCouldNotDetermineFirstRoza: 'Could not determine first roza date.',
	errorCouldNotDetermineRoza: 'Could not determine roza number.',
	errorCouldNotFindFirstDay: 'Could not find the first day of Ramadan.',
	errorInvalidLatitude: 'Invalid latitude.',
	errorInvalidLongitude: 'Invalid longitude.',
	errorInvalidMethod: 'Invalid method.',
	errorInvalidSchool: 'Invalid school.',

	// Language names
	langEnglish: 'English',
	langIndonesian: 'Bahasa Indonesia',
};

export default en;
