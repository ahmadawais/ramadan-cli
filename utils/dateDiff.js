module.exports = (first, second) => {
	// Take the difference between the dates and divide by milliseconds per day.
	// Round to nearest whole number to deal with DST.
	return Math.round(
		(new Date(second) - new Date(first)) / (1000 * 60 * 60 * 24)
	);
};
