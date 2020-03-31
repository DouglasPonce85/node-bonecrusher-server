const dateTimeRegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

module.exports = {
	reviveDates: (key, value) => {
		if (typeof value === 'string' && dateTimeRegExp.test(value)) {
			return new Date(value);
		}
		return value;
	}
};
