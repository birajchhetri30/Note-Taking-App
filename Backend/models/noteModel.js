const db = require('../db');
const { link } = require('../routes/userRoutes');

const createNote = async (connection, userId, title, content) => {
    const [result] = await connection.execute(
        'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
        [userId, title, content]
    );
    return result.insertId;
};

const getNotesByUser = async (userId) => {
    const [rows] = await db.execute(
        'SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
    );
    return rows;
};

const getNoteById = async (noteId, userId) => {
    const [rows] = await db.execute(
        'SELECT * FROM notes WHERE id = ? AND user_id = ?',
        [noteId, userId]
    );
    return rows[0];
};

const updateNote = async (connection, noteId, userId, title, content) => {
    const [result] = await connection.execute(
        'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?',
        [title, content, noteId, userId]
    );
    return result.affectedRows;
};

const deleteNote = async (noteId, userId) => {
    const [result] = await db.execute(
        'DELETE FROM notes WHERE id = ? AND user_id = ?',
        [noteId, userId]
    );
    return result.affectedRows;
};


const findCategoryByName = async (connection, name, userId) => {
    const [rows] = await connection.execute(
        'SELECT id FROM categories WHERE name = ? AND (user_id = ? OR user_id IS NULL) LIMIT 1',
        [name, userId]
    );
    return rows[0];
};

const createCategory = async (connection, name, userId) => {
    const [result] = await connection.execute(
        'INSERT INTO categories (name, user_id) VALUES (?, ?)',
        [name, userId]
    );
    return result.insertId;
};

const linkNoteCategory = async (connection, noteId, categoryId) => {
    await connection.execute(
        'INSERT INTO notecategories (note_id, category_id) VALUES (?, ?)',
        [noteId, categoryId]
    );
};

const addCategoryToNote = async (noteId, categoryId) => {
    await db.execute(
        'INSERT INTO notecategories (note_id, category_id) VALUES (?, ?)',
        [noteId, categoryId]
    );
};

const removeCategoryFromNote = async (noteId, categoryId) => {
    await db.execute(
        'DELETE FROM notecategories WHERE note_id = ? AND category_id = ?',
        [noteId, categoryId]
    );
};

const getFilteredNotes = async (userId, {
    categoryId = [],
    limit,
    offset,
    sortBy,
    order,
    search
}) => {
    let sql = `
    SELECT DISTINCT n.*
    FROM notes n
    LEFT JOIN notecategories nc 
    ON n.id = nc.note_id
    WHERE n.user_id = ?
    `;

    const params = [userId];

    if (search) {
        sql += ' AND n.title LIKE ?';
        params.push(`%${search}%`);
    }

    if (categoryId.length > 0) {
        sql += ` AND nc.category_id IN (${categoryId.map(() => '?').join(',')})`;
        params.push(...categoryId);
    }

    sql += ` ORDER BY ${sortBy || 'created_at'} ${order || 'DESC'}`;
    // sql += ` GROUP BY n.id ORDER BY ${sortBy || 'created_at'} ${order || 'DESC'} LIMIT ? OFFSET ?`;
    // params.push(parseInt(limit), parseInt(offset));

    const [rows] = await db.query(sql, params);
    return rows;
};

module.exports = {
    createNote,
    getNotesByUser,
    getNoteById,
    updateNote,
    deleteNote,
    findCategoryByName,
    createCategory,
    linkNoteCategory,
    addCategoryToNote,
    removeCategoryFromNote,
    getFilteredNotes,
};