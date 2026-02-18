import { z } from 'zod';

export interface GeoLocation {
	readonly city: string;
	readonly country: string;
	readonly latitude: number;
	readonly longitude: number;
	readonly timezone: string;
}

export interface CityCountryGuess {
	readonly city: string;
	readonly country: string;
	readonly latitude: number;
	readonly longitude: number;
	readonly timezone?: string;
}

const IpApiSchema = z.object({
	city: z.string(),
	country: z.string(),
	lat: z.number(),
	lon: z.number(),
	timezone: z.string().optional(),
});

const IpapiCoSchema = z.object({
	city: z.string(),
	country_name: z.string(),
	latitude: z.number(),
	longitude: z.number(),
	timezone: z.string().optional(),
});

const IpWhoisSchema = z.object({
	success: z.boolean(),
	city: z.string(),
	country: z.string(),
	latitude: z.number(),
	longitude: z.number(),
	timezone: z
		.object({
			id: z.string().optional(),
		})
		.optional(),
});

const OpenMeteoSearchSchema = z.object({
	results: z
		.array(
			z.object({
				name: z.string(),
				country: z.string(),
				latitude: z.number(),
				longitude: z.number(),
				timezone: z.string().optional(),
			})
		)
		.optional(),
});

const fetchJson = async (url: string): Promise<unknown> => {
	const response = await fetch(url);
	return (await response.json()) as unknown;
};

const tryIpApi = async (): Promise<GeoLocation | null> => {
	try {
		const json = await fetchJson(
			'http://ip-api.com/json/?fields=city,country,lat,lon,timezone'
		);
		const parsed = IpApiSchema.safeParse(json);
		if (!parsed.success) {
			return null;
		}
		return {
			city: parsed.data.city,
			country: parsed.data.country,
			latitude: parsed.data.lat,
			longitude: parsed.data.lon,
			timezone: parsed.data.timezone ?? '',
		};
	} catch {
		return null;
	}
};

const tryIpapiCo = async (): Promise<GeoLocation | null> => {
	try {
		const json = await fetchJson('https://ipapi.co/json/');
		const parsed = IpapiCoSchema.safeParse(json);
		if (!parsed.success) {
			return null;
		}
		return {
			city: parsed.data.city,
			country: parsed.data.country_name,
			latitude: parsed.data.latitude,
			longitude: parsed.data.longitude,
			timezone: parsed.data.timezone ?? '',
		};
	} catch {
		return null;
	}
};

const tryIpWhois = async (): Promise<GeoLocation | null> => {
	try {
		const json = await fetchJson('https://ipwho.is/');
		const parsed = IpWhoisSchema.safeParse(json);
		if (!parsed.success) {
			return null;
		}
		if (!parsed.data.success) {
			return null;
		}
		return {
			city: parsed.data.city,
			country: parsed.data.country,
			latitude: parsed.data.latitude,
			longitude: parsed.data.longitude,
			timezone: parsed.data.timezone?.id ?? '',
		};
	} catch {
		return null;
	}
};

export const guessLocation = async (): Promise<GeoLocation | null> => {
	const fromIpApi = await tryIpApi();
	if (fromIpApi) {
		return fromIpApi;
	}

	const fromIpapi = await tryIpapiCo();
	if (fromIpapi) {
		return fromIpapi;
	}

	return tryIpWhois();
};

export const guessCityCountry = async (
	query: string
): Promise<CityCountryGuess | null> => {
	const trimmedQuery = query.trim();
	if (!trimmedQuery) {
		return null;
	}

	try {
		const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
		url.searchParams.set('name', trimmedQuery);
		url.searchParams.set('count', '1');
		url.searchParams.set('language', 'en');
		url.searchParams.set('format', 'json');

		const json = await fetchJson(url.toString());
		const parsed = OpenMeteoSearchSchema.safeParse(json);
		if (!parsed.success) {
			return null;
		}

		const result = parsed.data.results?.[0];
		if (!result) {
			return null;
		}

			return {
				city: result.name,
				country: result.country,
				latitude: result.latitude,
				longitude: result.longitude,
				...(result.timezone ? { timezone: result.timezone } : {}),
			};
	} catch {
		return null;
	}
};
