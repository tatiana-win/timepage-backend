const express = require('express');
const {verifyToken} = require("../middlewares/authJwt");
const router = express.Router();
const notesController = require('../controllers/notes.controller');

router.get('/', [verifyToken], notesController.getNotes);
router.post('/', [verifyToken], notesController.createNote);
router.patch('/:id', [verifyToken], notesController.updateNote);
router.delete('/:id', [verifyToken], notesController.deleteNote);

module.exports = router;
