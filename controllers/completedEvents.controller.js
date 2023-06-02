const { CompletedEvent } = require("../models/CompletedEvents");
const { Op } = require("sequelize");

exports.completeEvent = async (req, res) => {
    try {
        const event = await CompletedEvent.create({
            userId: req.userId,
            noteId: req.params.id,
            date: req.body.date,
        });
        res.json(event);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

exports.deleteCompletedEvent = async (req, res) => {
    try {
        await CompletedEvent.destroy({
            where: {
                noteId: req.params.id,
                date: req.body.date,
            }
        });
        res.status(200);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};

exports.getCompletedEvents = async (from, to, userId) => {
    return await CompletedEvent.findAll({
        where: {
            date: {
                [Op.lt]: to,
                [Op.gt]: from
            },
            userId: {
                [Op.eq]: userId
            }
        }
    });
}
