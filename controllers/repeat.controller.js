const { RepeatEvent } = require("../models/RepeatEvent");
const { daysOfWeek, getDateForDayOfWeek } = require("../helpers/dates.utils");
const { Op } = require("sequelize");
const { Note } = require("../models/Note");

const DEFAULT_YEAR = 1980;

const createRepeatEvent = async (note) => {
    const event = {
        noteId: note.id,
        userId: note.userId,
        originalDate: note.date,
        ...setEventDates(note.date, note.period)
    };
    await RepeatEvent.create(event);
};

const updateRepeatEvent = async (note) => {
    await RepeatEvent.update({
        ...setEventDates(note.date, note.period),
        originalDate: note.date,
    }, {
        where: {
            noteId: note.id
        }
    });
};

const deleteRepeatEvent = async (noteId) => {
    return await RepeatEvent.destroy({
        where: {
            noteId
        }
    });
};

/**
 * Returns events for a specific date range and a specific user
 * @param from
 * @param to
 * @param userId
 */
const getRepeatNotes = async (from, to, userId) => {
    const maxDate = to.getDate();
    const minDate = from.getDate();

    const repeatEvents = (await RepeatEvent.findAll({
        where: {
            [Op.or]: {
                dayOfWeek: { [Op.ne]: null },
                day: getDayCondition(minDate, maxDate),
                date: getDateCondition(from, to)
            },
            userId: {
                [Op.eq]: userId
            },
            originalDate: {
                [Op.lt]: new Date(from)
            }
        },
    }));

    const notesIds = repeatEvents.
        filter(event => !event.deletedDates?.some(date => from < date && to > date)).
        map(event => event.noteId);
    if (!notesIds.length) {
        return [];
    }

    return (await Note.findAll({
        where: { id: notesIds },
        order: [
            ['createdAt', 'ASC']
        ],
    })).map(note => {
        const event = repeatEvents.find(ev => ev.noteId === note.id);
        note.date = getEventDate(event, from, to);
        return note;
    });
}

/**
 * Create sequelize condition for day field
 * For example, for date range from 29.05 to 04.06 it will be:
 * 29 <= day <= 31 || 1 <= day <= 4
 * @param minDate
 * @param maxDate
 * @returns {{}|{}}
 */
const getDayCondition = (minDate, maxDate) => {
    return minDate > maxDate ? {
        [Op.or]: [{
            [Op.lte]: 31,
            [Op.gte]: minDate
        },{
            [Op.lte]: maxDate,
            [Op.gte]: 1
        }]
    } : {
        [Op.lte]: maxDate,
        [Op.gte]: minDate
    };
}

/**
 * Create sequelize condition for date field
 * For example, for date range from 29.05.2023 to 04.06.2023 it will be:
 * 29.05.1980 <= day <= 04.06.1980
 * @param fromString
 * @param toString
 * @returns {{}}
 */
const getDateCondition = (fromString, toString) => {
    const from = new Date(fromString);
    const to = new Date(toString);
    const fromYear = from.getFullYear();
    const toYear = to.getFullYear();

    from.setFullYear(fromYear !== toYear ? DEFAULT_YEAR - 1 : DEFAULT_YEAR);
    to.setFullYear(DEFAULT_YEAR);

    return {
        [Op.gte]: from,
        [Op.lte]: to
    };
}

/**
 * Returns date based on the date range and the repeat event conditions
 * For example, for date range from 29.05.2023 to 04.06.2023 it will be:
 * For every week event with dayOfWeek=Wed: 31.05.2023
 * For every month with day=2: 02.06.2023
 * For every year with date=1980-05-31: 31.05.2023
 * @param event
 * @param from
 * @param to
 * @returns {Date}
 */
const getEventDate = (event, from ,to) => {
    let eventDate;
    if (event.dayOfWeek) {
        eventDate = getDateForDayOfWeek(from, event.dayOfWeek);
    }
    if (event.day) {
        if (event.day < 8) {
            eventDate = new Date(to);
            eventDate.setDate(event.day);
        } else {
            eventDate = new Date(from);
            eventDate.setDate(event.day);
        }
    }
    if (event.date) {
        const fromYear = (new Date(from)).getFullYear();
        const toYear = (new Date(to)).getFullYear();
        const eventMonth = (new Date(event.date)).getMonth();
        if (fromYear === toYear || eventMonth === 11) {
            eventDate = new Date(event.date);
            eventDate.setFullYear(fromYear);
        } else {
            eventDate = new Date(event.date);
            eventDate.setFullYear(toYear);
        }
    }

    const time = new Date(event.originalDate);
    eventDate.setHours(time.getHours());
    eventDate.setMinutes(time.getMinutes());
    return eventDate;
}

/**
 * Set event fields based on period
 * For date 30.05.2023 it will be:
 * For every week: dayOfWeek = Tue
 * For every month: day = 30
 * For every year: date = 1980-05-30
 * @param date
 * @param period
 */
const setEventDates = (date, period) => {
    const event = {
        dayOfWeek: null,
        day: null,
        date: null
    };
    switch (period) {
        case 'week':
            event.dayOfWeek = daysOfWeek[(new Date(date)).getDay()];
            break;
        case 'month':
            event.day = (new Date(date)).getDate();
            break;
        case 'year':
            event.date = (new Date(date)).setFullYear(DEFAULT_YEAR);
    }

    return event;
}

const deleteRepeatEventForDate = async (noteId, date) => {
    const event = (await RepeatEvent.findAll({
        where: {
            noteId
        }
    }))[0];
    if (!event) {
        return;
    }

    if (event.deletedDates) {
        event.deletedDates.push(date);
    } else {
        event.deletedDates = [date];
    }
    return RepeatEvent.update({
        deletedDates: event.deletedDates
        },
        {
            where: {
                id: event.id
            }
        });
}

module.exports = {
    createRepeatEvent,
    updateRepeatEvent,
    deleteRepeatEvent,
    getRepeatNotes,
    deleteRepeatEventForDate
}
