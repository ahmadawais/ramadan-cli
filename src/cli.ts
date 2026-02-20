import { createRequire } from 'node:module';
import { InvalidArgumentError, program } from 'commander';
import { configCommand } from './commands/config.js';
import { ramadanCommand } from './commands/ramadan.js';
import { setLocale, t } from './i18n/index.js';
import { clearRamadanConfig, getStoredLanguage } from './ramadan-config.js';

interface RootOptions {
	readonly city?: string | undefined;
	readonly all?: boolean | undefined;
	readonly number?: number | undefined;
	readonly plain?: boolean | undefined;
	readonly json?: boolean | undefined;
	readonly status?: boolean | undefined;
	readonly firstRozaDate?: string | undefined;
	readonly clearFirstRozaDate?: boolean | undefined;
	readonly lang?: string | undefined;
}

interface ConfigOptions {
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

const require = createRequire(import.meta.url);
const pkg = require('../package.json') as {
	readonly version: string;
};

// Initialize locale from stored preference before parsing CLI
const storedLang = getStoredLanguage();
setLocale(storedLang);

// Check for --lang flag early so descriptions render in the right language
const langFlagIndex = process.argv.indexOf('--lang');
const langShortIndex = process.argv.indexOf('-l');
const langIndex = langFlagIndex !== -1 ? langFlagIndex : langShortIndex;
if (langIndex !== -1 && process.argv[langIndex + 1]) {
	setLocale(process.argv[langIndex + 1] as string);
}

const parseRozaNumber = (value: string): number => {
	const parsed = Number.parseInt(value, 10);
	const isInvalid =
		Number.isNaN(parsed) ||
		!Number.isInteger(parsed) ||
		parsed < 1 ||
		parsed > 30;

	if (isInvalid) {
		throw new InvalidArgumentError(t('cliRozaNumberError'));
	}

	return parsed;
};

program
	.name('ramadan-cli')
	.description(t('cliDescription'))
	.version(pkg.version, '-v, --version')
	.argument('[city]', t('cliCityArg'))
	.option('-c, --city <city>', t('cliCityOption'))
	.option('-a, --all', t('cliAllOption'))
	.option('-n, --number <number>', t('cliNumberOption'), parseRozaNumber)
	.option('-p, --plain', t('cliPlainOption'))
	.option('-j, --json', t('cliJsonOption'))
	.option('-s, --status', t('cliStatusOption'))
	.option('--first-roza-date <YYYY-MM-DD>', t('cliFirstRozaDateOption'))
	.option('--clear-first-roza-date', t('cliClearFirstRozaDateOption'))
	.option('-l, --lang <lang>', t('cliLangOption'))
	.action(async (cityArg: string | undefined, opts: RootOptions) => {
		await ramadanCommand({
			city: cityArg || opts.city,
			all: opts.all,
			rozaNumber: opts.number,
			plain: opts.plain,
			json: opts.json,
			status: opts.status,
			firstRozaDate: opts.firstRozaDate,
			clearFirstRozaDate: opts.clearFirstRozaDate,
		});
	});

program
	.command('reset')
	.description(t('cliResetDescription'))
	.action(() => {
		clearRamadanConfig();
		console.log(t('configReset'));
	});

program
	.command('config')
	.description(t('cliConfigDescription'))
	.option('--city <city>', t('cliConfigCityOption'))
	.option('--country <country>', t('cliConfigCountryOption'))
	.option('--latitude <latitude>', t('cliConfigLatitudeOption'))
	.option('--longitude <longitude>', t('cliConfigLongitudeOption'))
	.option('--method <id>', t('cliConfigMethodOption'))
	.option('--school <id>', t('cliConfigSchoolOption'))
	.option('--timezone <timezone>', t('cliConfigTimezoneOption'))
	.option('--lang <lang>', t('cliConfigLangOption'))
	.option('--show', t('cliConfigShowOption'))
	.option('--clear', t('cliConfigClearOption'))
	.action(async (opts: ConfigOptions) => {
		await configCommand(opts);
	});

program.parse();
