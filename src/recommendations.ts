const countryMethodMap: Readonly<Record<string, number>> = {
	'United States': 2,
	USA: 2,
	US: 2,
	Canada: 2,
	Mexico: 2,
	Pakistan: 1,
	Bangladesh: 1,
	India: 1,
	Afghanistan: 1,
	'United Kingdom': 3,
	UK: 3,
	Germany: 3,
	Netherlands: 3,
	Belgium: 3,
	Sweden: 3,
	Norway: 3,
	Denmark: 3,
	Finland: 3,
	Austria: 3,
	Switzerland: 3,
	Poland: 3,
	Italy: 3,
	Spain: 3,
	Greece: 3,
	Japan: 3,
	China: 3,
	'South Korea': 3,
	Australia: 3,
	'New Zealand': 3,
	'South Africa': 3,
	'Saudi Arabia': 4,
	Yemen: 4,
	Oman: 4,
	Bahrain: 4,
	Egypt: 5,
	Syria: 5,
	Lebanon: 5,
	Palestine: 5,
	Jordan: 5,
	Iraq: 5,
	Libya: 5,
	Sudan: 5,
	Iran: 7,
	Kuwait: 9,
	Qatar: 10,
	Singapore: 11,
	France: 12,
	Turkey: 13,
	Türkiye: 13,
	Russia: 14,
	'United Arab Emirates': 16,
	UAE: 16,
	Malaysia: 17,
	Brunei: 17,
	Tunisia: 18,
	Algeria: 19,
	Indonesia: 20,
	Morocco: 21,
	Portugal: 22,
};

const hanafiCountries = new Set<string>([
	'Pakistan',
	'Bangladesh',
	'India',
	'Afghanistan',
	'Turkey',
	'Türkiye',
	'Iraq',
	'Syria',
	'Jordan',
	'Palestine',
	'Kazakhstan',
	'Uzbekistan',
	'Tajikistan',
	'Turkmenistan',
	'Kyrgyzstan',
]);

export const getRecommendedMethod = (country: string): number | null => {
	const direct = countryMethodMap[country];
	if (direct !== undefined) {
		return direct;
	}

	const lowerCountry = country.toLowerCase();
	for (const [key, value] of Object.entries(countryMethodMap)) {
		if (key.toLowerCase() === lowerCountry) {
			return value;
		}
	}

	return null;
};

// Official Ramadan start dates by Hijri year, based on moon sighting announcements.
// Only explicitly verified countries are listed. Unknown countries fall back to the
// API's computational Hijri date. Update this map each Ramadan season — if no data
// exists for a year, the CLI behaves exactly as before.
// Sources for 1447:
// - https://khaleejtimes.com/ramadan/countries-that-will-begin-holy-month-feb-19-2026
// - https://gulfnews.com/uae/ramadan/ramadan-2026-in-uae-crescent-moon-sighting-and-announcements-worldwide-1.500445904
const ramadanStartDates: Readonly<
	Record<number, Readonly<Record<string, string>>>
> = {
	1447: {
		// Feb 18 — crescent sighted on Feb 17
		'Saudi Arabia': '2026-02-18',
		UAE: '2026-02-18',
		'United Arab Emirates': '2026-02-18',
		Qatar: '2026-02-18',
		Kuwait: '2026-02-18',
		Bahrain: '2026-02-18',
		Palestine: '2026-02-18',
		Lebanon: '2026-02-18',
		Yemen: '2026-02-18',
		Iran: '2026-02-18',
		Iraq: '2026-02-18',
		// Feb 19 — crescent not sighted on Feb 17
		Egypt: '2026-02-19',
		Turkey: '2026-02-19',
		Türkiye: '2026-02-19',
		Oman: '2026-02-19',
		Jordan: '2026-02-19',
		Syria: '2026-02-19',
		Morocco: '2026-02-19',
		Sudan: '2026-02-19',
		Pakistan: '2026-02-19',
		India: '2026-02-19',
		Bangladesh: '2026-02-19',
		Indonesia: '2026-02-19',
		Malaysia: '2026-02-19',
		Singapore: '2026-02-19',
		Australia: '2026-02-19',
		'United Kingdom': '2026-02-19',
		UK: '2026-02-19',
		France: '2026-02-19',
	},
};

export const getCountryRamadanStartDate = (
	country: string,
	hijriYear: number
): string | null => {
	const yearData = ramadanStartDates[hijriYear];
	if (!yearData) {
		return null;
	}

	const direct = yearData[country];
	if (direct !== undefined) {
		return direct;
	}

	const lowerCountry = country.toLowerCase();
	for (const [key, value] of Object.entries(yearData)) {
		if (key.toLowerCase() === lowerCountry) {
			return value;
		}
	}

	return null;
};

export const getRecommendedSchool = (country: string): number => {
	if (hanafiCountries.has(country)) {
		return 1;
	}

	const lowerCountry = country.toLowerCase();
	for (const listedCountry of hanafiCountries) {
		if (listedCountry.toLowerCase() === lowerCountry) {
			return 1;
		}
	}

	return 0;
};
