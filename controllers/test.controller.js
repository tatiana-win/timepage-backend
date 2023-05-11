const { User } = require('../models/User');
const { Note } = require("../models/Note");
const bcrypt = require("bcryptjs");

exports.dropTables = async (req, res) => {
    if (process.env.NODE_ENV !== 'test') {
        res.status(403);
    }
    // Clear all tables
    try {
        await User.destroy({ truncate: true });
        await Note.destroy({ truncate: true });
        await User.create({
            username: 'testUser',
            email: 'test@gmail.com',
            password: bcrypt.hashSync('111111', 8),
        });
        res.send('Done');
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
