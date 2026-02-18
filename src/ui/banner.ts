import pc from 'picocolors';

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

const tagLine = 'COMPOSABLE RAMADAN + AZAN CLI';

export const getBanner = (): string => {
	const width = process.stdout.columns ?? 80;
	const art = width >= 120 ? ANSI_SHADOW : ANSI_COMPACT;
	const artColor = pc.white(art.trimEnd());
	const tag = pc.dim(`  ${tagLine}`);
	return `\n${artColor}\n${tag}\n`;
};
