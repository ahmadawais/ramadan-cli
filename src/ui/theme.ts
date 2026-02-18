import pc from 'picocolors';

export const MOON_EMOJI = '🌙';

const RAMADAN_GREEN_RGB = '38;2;128;240;151';
const ANSI_RESET = '\u001B[0m';

const supportsTrueColor = (): boolean => {
	const colorTerm = process.env.COLORTERM?.toLowerCase() ?? '';
	return colorTerm.includes('truecolor') || colorTerm.includes('24bit');
};

export const ramadanGreen = (value: string): string => {
	if (!pc.isColorSupported) {
		return value;
	}

	if (!supportsTrueColor()) {
		return pc.green(value);
	}

	return `\u001B[${RAMADAN_GREEN_RGB}m${value}${ANSI_RESET}`;
};
