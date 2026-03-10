import { exec } from 'node:child_process';
import { dirname, join } from 'node:path';
import { platform } from 'node:os';
import { fileURLToPath } from 'node:url';
import pc from 'picocolors';
import type { PrayerData } from './api.js';
import { ramadanGreen } from './ui/theme.js';
import { getBanner } from './ui/banner.js';
import { getStoredLocation } from './ramadan-config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

type AzanEvent = 'Fajr' | 'Maghrib';

interface AzanCheckResult {
	readonly event: AzanEvent;
	readonly time: string;
}

const parsePrayerTimeToMinutes = (value: string): number | null => {
	const cleanValue = value.split(' ')[0] ?? value;
	const match = cleanValue.match(/^(\d{1,2}):(\d{2})$/);
	if (!match) {
		return null;
	}

	const hour = Number.parseInt(match[1] ?? '', 10);
	const minute = Number.parseInt(match[2] ?? '', 10);
	if (
		Number.isNaN(hour) ||
		Number.isNaN(minute) ||
		hour < 0 ||
		hour > 23 ||
		minute < 0 ||
		minute > 59
	) {
		return null;
	}

	return hour * 60 + minute;
};

const getNowMinutes = (timezone: string): number | null => {
	try {
		const formatter = new Intl.DateTimeFormat('en-GB', {
			timeZone: timezone,
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		});
		const parts = formatter.formatToParts(new Date());
		const hour = Number.parseInt(
			parts.find((p) => p.type === 'hour')?.value ?? '',
			10
		);
		const minute = Number.parseInt(
			parts.find((p) => p.type === 'minute')?.value ?? '',
			10
		);

		if (Number.isNaN(hour) || Number.isNaN(minute)) {
			return null;
		}

		return (hour === 24 ? 0 : hour) * 60 + minute;
	} catch {
		return null;
	}
};

const to12Hour = (value: string): string => {
	const cleanValue = value.split(' ')[0] ?? value;
	const match = cleanValue.match(/^(\d{1,2}):(\d{2})$/);
	if (!match) {
		return cleanValue;
	}
	const h = Number.parseInt(match[1] ?? '', 10);
	const m = match[2] ?? '00';
	const period = h >= 12 ? 'PM' : 'AM';
	return `${h % 12 || 12}:${m} ${period}`;
};

export const checkAzanTime = (
	today: PrayerData
): AzanCheckResult | null => {
	const nowMinutes = getNowMinutes(today.meta.timezone);
	if (nowMinutes === null) {
		return null;
	}

	const fajrMinutes = parsePrayerTimeToMinutes(today.timings.Fajr);
	const maghribMinutes = parsePrayerTimeToMinutes(today.timings.Maghrib);

	if (fajrMinutes !== null && nowMinutes === fajrMinutes) {
		return { event: 'Fajr', time: today.timings.Fajr };
	}

	if (maghribMinutes !== null && nowMinutes === maghribMinutes) {
		return { event: 'Maghrib', time: today.timings.Maghrib };
	}

	return null;
};

export const getNextAzanInfo = (
	today: PrayerData
): { event: AzanEvent; minutesUntil: number } | null => {
	const nowMinutes = getNowMinutes(today.meta.timezone);
	if (nowMinutes === null) {
		return null;
	}

	const fajrMinutes = parsePrayerTimeToMinutes(today.timings.Fajr);
	const maghribMinutes = parsePrayerTimeToMinutes(today.timings.Maghrib);

	const candidates: Array<{ event: AzanEvent; minutesUntil: number }> = [];

	if (fajrMinutes !== null) {
		const diff = fajrMinutes - nowMinutes;
		if (diff > 0) {
			candidates.push({ event: 'Fajr', minutesUntil: diff });
		}
	}

	if (maghribMinutes !== null) {
		const diff = maghribMinutes - nowMinutes;
		if (diff > 0) {
			candidates.push({ event: 'Maghrib', minutesUntil: diff });
		}
	}

	if (candidates.length === 0) {
		// Next azan is tomorrow's Fajr
		if (fajrMinutes !== null) {
			const minutesUntil = 24 * 60 - nowMinutes + fajrMinutes;
			return { event: 'Fajr', minutesUntil };
		}
		return null;
	}

	candidates.sort((a, b) => a.minutesUntil - b.minutesUntil);
	return candidates[0] ?? null;
};

const playSystemSound = (): void => {
	const os = platform();

	if (os === 'darwin') {
		exec('afplay /System/Library/Sounds/Ping.aiff');
	} else if (os === 'win32') {
		exec(
			`powershell -c "Add-Type -AssemblyName presentationCore; $player = New-Object System.Windows.Media.MediaPlayer; $player.Open('${join(process.cwd(), 'audio/azan1.mp3')}'); $player.Play(); Start-Sleep 90; $player.Stop()"`
		);
	} else {
		exec(
			'paplay /usr/share/sounds/freedesktop/stereo/bell.oga 2>/dev/null || aplay /usr/share/sounds/alsa/Front_Center.wav 2>/dev/null || true'
		);
	}

	// Terminal bell as universal fallback
	process.stdout.write('\x07');
};

const formatMinutes = (minutes: number): string => {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	if (h === 0) {
		return `${m}m`;
	}
	return `${h}h ${m}m`;
};

export const printAzanAlert = (event: AzanEvent, time: string): void => {
	const label = event === 'Fajr' ? '🌙 Fajr (Sehar)' : '🌅 Maghrib (Iftar)';
	console.log('');
	console.log(ramadanGreen(`  🔊 AZAN TIME — ${label}`));
	console.log(pc.white(`  Time: ${to12Hour(time)}`));
	console.log('');
	playSystemSound();
};

export const startAzanWatcher = (
	fetchToday: () => Promise<PrayerData>,
	onStop?: () => void
): void => {
	const alreadyPlayed = new Set<string>();
	const todayKey = (): string => new Date().toISOString().slice(0, 10);

	const check = async (): Promise<void> => {
		try {
			const today = await fetchToday();
			const result = checkAzanTime(today);
			if (result) {
				const key = `${todayKey()}-${result.event}`;
				if (!alreadyPlayed.has(key)) {
					alreadyPlayed.add(key);
					printAzanAlert(result.event, result.time);
				}
			}
		} catch {
			// silent retry on next interval
		}
	};

	const displayStatus = async (): Promise<void> => {
		try {
			const today = await fetchToday();
			const location = getStoredLocation();
			console.clear();
			console.log(getBanner());
			console.log('  Today Sehar/Iftar');
			console.log(`  📍 ${location.city}, ${location.country}`);
			console.log('');
			const next = getNextAzanInfo(today);
			if (next) {
				console.log(`  Next azan: ${next.event} in ${formatMinutes(next.minutesUntil)}`);
				console.log(pc.dim(`  Fajr: ${to12Hour(today.timings.Fajr)}  |  Maghrib: ${to12Hour(today.timings.Maghrib)}`));
			}
			console.log('');
			console.log(ramadanGreen('  🔊 Azan watcher running...'));
			console.log(pc.dim('  Press \'f\' for Fajr azan, \'m\' for Maghrib azan, Ctrl+C to stop.'));
		} catch {
			// silent on error
		}
	};

	// Initial display
	void displayStatus();

	// Check every 30 seconds
	const interval = setInterval(() => void check(), 30_000);

	// Display update every 30 seconds
	const displayInterval = setInterval(() => void displayStatus(), 30_000);

	// Set up interactive key listening
	process.stdin.setRawMode(true);
	process.stdin.resume();
	process.stdin.on('data', (key) => {
		if (key[0] === 3) { // Ctrl+C
			cleanup();
			console.log(pc.dim('\n  Azan watcher stopped.'));
			process.exit(0);
		}
		const keyStr = key.toString().toLowerCase();
		if (keyStr === 'f') {
			fetchToday().then(today => {
				printAzanAlert('Fajr', today.timings.Fajr);
			}).catch(() => {});
		}
		if (keyStr === 'm') {
			fetchToday().then(today => {
				printAzanAlert('Maghrib', today.timings.Maghrib);
			}).catch(() => {});
		}
	});

	const cleanup = (): void => {
		clearInterval(interval);
		clearInterval(displayInterval);
		process.stdin.setRawMode(false);
		process.stdin.pause();
		onStop?.();
	};

	process.on('SIGTERM', () => {
		cleanup();
		process.exit(0);
	});
};
