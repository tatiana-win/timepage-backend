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

const getRepeatNotes = async (from, to, userId, excludeIds) => {
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
            }
        },
    }));

    const notesIds = repeatEvents.map(event => event.noteId).filter(id => !excludeIds.includes(id));
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
        console.log('!!!!!!!!', event);
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

module.exports = {
    createRepeatEvent,
    updateRepeatEvent,
    deleteRepeatEvent,
    getRepeatNotes
}
