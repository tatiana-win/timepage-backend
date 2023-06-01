const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const daysOfWeekFromMonday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Returns new date calculated as passed date + passed days
 * @param date
 * @param days
 */
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(date.getDate() + days);

    return result;
};

/**
 * Returns date of Monday for week that contains passed date
 * @param date
 */
const getStartOfWeek = (date) => {
    const dayOfWeek = date.getDay() > 0 ? date.getDay() - 1 : 6;
    const result = new Date(date);
    result.setDate(date.getDate() - dayOfWeek);

    return result;
};

/**
 * Returns date for passed start of week date and day of week
 * @param date - date of start of period
 * @param dayOfWeek - name of day
 * @returns {Date}
 */
const getDateForDayOfWeek = (date, dayOfWeek) => {
    const startOfWeek = getStartOfWeek(addDays(date, 1));
    return addDays(startOfWeek, daysOfWeekFromMonday.indexOf(dayOfWeek));
};

module.exports = {
    addDays,
    getStartOfWeek,
    getDateForDayOfWeek,
    daysOfWeek
}
