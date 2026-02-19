import pc from 'picocolors';
import { t } from '../i18n/index.js';
import { MOON_EMOJI, ramadanGreen } from './theme.js';

const ANSI_SHADOW = `
██████╗  █████╗ ███╗   ███╗ █████╗ ██████╗  █████╗ ███╗   ██╗
██╔══██╗██╔══██╗████╗ ████║██╔══██╗██╔══██╗██╔══██╗████╗  ██║
██████╔╝███████║██╔████╔██║███████║██║  ██║███████║██╔██╗ ██║
██╔══██╗██╔══██║██║╚██╔╝██║██╔══██║██║  ██║██╔══██║██║╚██╗██║
██║  ██║██║  ██║██║ ╚═╝ ██║██║  ██║██████╔╝██║  ██║██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝
`;

const ANSI_COMPACT = `
██████  █████  ███    ███  █████  ██████   █████  ███    ██
██   ██ ██   ██ ████  ████ ██   ██ ██   ██ ██   ██ ████   ██
██████  ███████ ██ ████ ██ ███████ ██   ██ ███████ ██ ██  ██
██   ██ ██   ██ ██  ██  ██ ██   ██ ██   ██ ██   ██ ██  ██ ██
██   ██ ██   ██ ██      ██ ██   ██ ██████  ██   ██ ██   ████
`;

export const getBanner = (): string => {
	const width = process.stdout.columns ?? 80;
	const art = width >= 120 ? ANSI_SHADOW : ANSI_COMPACT;
	const artColor = ramadanGreen(art.trimEnd());
	const lead = ramadanGreen(`  ${t('bannerLabel')}`);
	const tag = pc.dim(`  ${t('bannerTagline')}`);
	return `\n${artColor}\n${lead}\n${tag}\n`;
};
