import pc from 'picocolors';
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

const tagLine = 'Sehar • Iftar • Ramadan timings';

export const getBanner = (): string => {
	const width = process.stdout.columns ?? 80;
	const art = width >= 120 ? ANSI_SHADOW : ANSI_COMPACT;
	const artColor = ramadanGreen(art.trimEnd());
	const lead = ramadanGreen(`  ${MOON_EMOJI} Ramadan CLI`);
	const tag = pc.dim(`  ${tagLine}`);
	return `\n${artColor}\n${lead}\n${tag}\n`;
};
