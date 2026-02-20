import en from './locales/en.js';
import id from './locales/id.js';

export type Locale = typeof en;
export type LocaleKey = keyof Locale;
export type SupportedLang = 'en' | 'id';

const locales: Readonly<Record<SupportedLang, Locale>> = { en, id };

let currentLang: SupportedLang = 'en';
let currentLocale: Locale = en;

export const SUPPORTED_LANGUAGES: ReadonlyArray<SupportedLang> = ['en', 'id'];

export const isSupportedLang = (value: string): value is SupportedLang =>
	SUPPORTED_LANGUAGES.includes(value as SupportedLang);

export const setLocale = (lang: string): void => {
	if (!isSupportedLang(lang)) {
		return;
	}

	currentLang = lang;
	currentLocale = locales[lang];
};

export const getLocale = (): SupportedLang => currentLang;

export const t = (
	key: LocaleKey,
	params?: Readonly<Record<string, string | number>>
): string => {
	let value: string = currentLocale[key] ?? key;

	if (params) {
		for (const [paramKey, paramValue] of Object.entries(params)) {
			value = value.replaceAll(`{${paramKey}}`, String(paramValue));
		}
	}

	return value;
};
