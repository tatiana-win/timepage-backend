const { Note } = require("../models/Note");
const { Op } = require('sequelize');
const { getRepeatNotes, createRepeatEvent, updateRepeatEvent, deleteRepeatEvent } = require("./repeat.controller");
const {getCompletedEvents} = require("./completedEvents.controller");

exports.getNotes = async (req, res) => {
    try {
        let notes;
        if (req.query.to && req.query.from) {
            const to = new Date(req.query.to);
            const from = new Date(req.query.from);
            notes = await Note.findAll({
                where: {
                    date: {
                        [Op.lt]: to,
                        [Op.gt]: from
                    },
                    userId: {
                        [Op.eq]: req.userId
                    }
                },
                order: [
                    ['createdAt', 'ASC']
                ],
            });


            notes = [...notes, ...(await getRepeatNotes(from, to, req.userId))];
            const completedEvents = await getCompletedEvents(from, to, req.userId);
            notes = notes.map(note => {
                const completed = !!completedEvents.find(event => event.noteId === note.id);
                return {
                    ...note.dataValues,
                    completed: completed
                }
            });
        } else {
            notes = await Note.findAll({
                where: {
                    date: null,
                    userId: {
                        [Op.eq]: req.userId
                    }
                },
                order: [
                    ['createdAt', 'ASC']
                ],
            });
        }

        res.json(notes);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
}

exports.createNote = async (req, res) => {
    try {
        const note = await Note.create({
            id: req.body.id,
            title: req.body.title,
            description: req.body.description,
            color: req.body.color,
            date: req.body.date,
            userId: req.userId,
            hasTime: req.body.hasTime,
            repeatable: req.body.repeatable,
            period: req.body.period
        });
        if (req.body.repeatable) {
            await createRepeatEvent(note);
        }
        res.json(note);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const oldNote = (await Note.findAll({
            where: {
                id: req.params.id
            }
        }))[0];

        if (oldNote?.repeatable && !req.body.repeatable) {
            await deleteRepeatEvent(req.params.id);
        }

        await Note.update({
            title: req.body.title,
            description: req.body.description,
            color: req.body.color,
            date: req.body.date,
            hasTime: req.body.hasTime,
            repeatable: req.body.repeatable,
            period: req.body.period,
            completed: req.body.completed
        }, {
            where: {
                id: req.params.id
            }
        });
        const newNote = (await Note.findAll({
            where: {
                id: req.params.id
            }
        }))[0];

        if (!oldNote?.repeatable && newNote.repeatable) {
            await createRepeatEvent(newNote);
        }

        if (oldNote?.repeatable && newNote.repeatable &&
            (oldNote?.date !== newNote.date || oldNote?.period !== newNote.period)
        ) {
            await updateRepeatEvent(newNote);
        }

        res.json(newNote);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        await Note.destroy({
            where: {
                id: req.params.id
            }
        });
        await deleteRepeatEvent(req.params.id);
        res.json(req.params.id);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};
