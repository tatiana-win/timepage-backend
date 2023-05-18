const express = require('express');
const {Note} = require("../models/Note");
const {Op} = require('sequelize');
const {verifyToken} = require("../middlewares/authJwt");
const router = express.Router();

router.get('/', [verifyToken], async function (req, res) {
    let notes = req.query.to && req.query.from ? await Note.findAll({
        where: {
            date: {
                [Op.lt]: new Date(req.query.to),
                [Op.gt]: new Date(req.query.from)
            },
            userId: {
                [Op.eq]: req.userId
            }
        },
        order: [
            ['createdAt', 'ASC']
        ],
    }) : await Note.findAll({
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

    res.json(notes);
});

router.post('/', [verifyToken], async function (req, res, next) {
    const note = await Note.create({
        id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        color: req.body.color,
        completed: req.body.completed,
        date: req.body.date,
        userId: req.userId,
        hasTime: req.body.hasTime
    });
    res.json(note);
});

router.patch('/:id', [verifyToken], async function (req, res, next) {
    const note = await Note.update({
        id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        color: req.body.color,
        completed: req.body.completed,
        date: req.body.date,
        hasTime: req.body.hasTime
    }, {
        where: {
            id: req.params.id
        }
    });
    res.json(note);
});

router.delete('/:id', [verifyToken], async function (req, res, next) {
    await Note.destroy({
        where: {
            id: req.params.id
        }
    });
    res.json(req.params.id);
});

module.exports = router;
