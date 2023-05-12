const { User } = require('../models/User');

checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        console.log('HERE', req.body)
        // Username
        let user = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        if (user) {
            return res.status(400).send({
                message: "Failed! Username is already in use!"
            });
        }

        // Email
        user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (user) {
            return res.status(400).send({
                message: "Failed! Email is already in use!"
            });
        }

        next();
    } catch (error) {
        return res.status(500).send({
            message: "Unable to validate Username!"
        });
    }
};
const err = {
    "name": "SequelizeDatabaseError",
    "parent": {
        "length": 109,
        "name": "error",
        "severity": "ERROR",
        "code": "42703",
        "position": "47",
        "file": "parse_relation.c",
        "line": "3643",
        "routine": "errorMissingColumn",
        "sql": "SELECT \"id\", \"username\", \"email\", \"password\", \"createdAt\", \"updatedAt\" FROM \"users\" AS \"user\" WHERE \"user\".\"username\" = 'myUser' LIMIT 1;"
    },
    "original": {
        "length": 109,
        "name": "error",
        "severity": "ERROR",
        "code": "42703",
        "position": "47",
        "file": "parse_relation.c",
        "line": "3643",
        "routine": "errorMissingColumn",
        "sql": "SELECT \"id\", \"username\", \"email\", \"password\", \"createdAt\", \"updatedAt\" FROM \"users\" AS \"user\" WHERE \"user\".\"username\" = 'myUser' LIMIT 1;"
    },
    "sql": "SELECT \"id\", \"username\", \"email\", \"password\", \"createdAt\", \"updatedAt\" FROM \"users\" AS \"user\" WHERE \"user\".\"username\" = 'myUser' LIMIT 1;",
    "parameters": {}
}
module.exports = { checkDuplicateUsernameOrEmail };