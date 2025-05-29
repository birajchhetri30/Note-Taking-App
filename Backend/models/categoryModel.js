const db = require('../db');

// categories of a particular note
const getCategoriesByNoteId = async (noteId) => {
    const [rows] = await db.execute(
        `SELECT c.id, c.name
        FROM categories c
        JOIN notecategories nc ON c.id = nc.category_id
        WHERE nc.note_id = ?
        `,
        [noteId]
    );
    return rows;
};

// all categories created by a user (includes predefined categories)
const getCategoriesByUserId = async (userId) => {
    const [rows] = await db.execute(
        `SELECT id, name, user_id
        FROM categories
        WHERE user_id = ? OR user_id IS NULL
        ORDER BY name
        `,
        [userId]
    );
    return rows;
} 

module.exports = {
    getCategoriesByNoteId,
    getCategoriesByUserId,
};