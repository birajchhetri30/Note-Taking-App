const db = require('../db');

const createUser = async (name, email, hashedPassword) => {
    const [result] = await db.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
    );
    return result.insertId;
};

const findUserByEmail = async (email) => {
    const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return rows[0];
};

const findUserById = async (id) => {
    const [rows] = await db.execute(
        'SELECT id, name, email FROM users WHERE id = ?', 
        [id]
);
    return rows[0];
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById
};
