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

const updateNote = async (noteId, userId, title, content) => {
    const [result] = await db.execute(
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


const findCategoryByName = async (name, userId) => {
    const [rows] = await db.execute(
        'SELECT id FROM categories WHERE name = ? AND (user_id = ? OR user_id IS NULL) LIMIT 1',
        [name, userId]
    );
    return rows[0];
};

const createCategory = async (name, userId) => {
    const [result] = await db.execute(
        'INSERT INTO categories (name, user_id) VALUES (?, ?)',
        [name, userId]
    );
    return result.insertId;
};

const linkNoteCategory = async (noteId, categoryId) => {
    await db.execute(
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
    categoryId,
    limit = 10,
    offset = 0,
    sortBy = 'created_at',
    order = 'DESC',
    search = ''
}) => {
    let baseQuery = `
    SELECT DISTINCT n.*
    FROM notes n
    LEFT JOIN notecategories nc 
    ON n.id = nc.note_id
    `;
    const conditions = [`n.user_id = ?`];
    const params = [userId];

    if (categoryId.length > 0) {
        const categoryList = Array.isArray(categoryId) ? categoryId : [categoryId];
        conditions.push(`nc.category_id IN (${categoryList.map(() => '?').join(',')})`);
        params.push(...categoryList);
    }

    if (search) {
        conditions.push(`(n.title LIKE ? OR n.content like ?)`);
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm);
    }

    if (conditions.length) {
        baseQuery += `WHERE ` + conditions.join(` AND `);
    }

    const allowedSortFields = ['created_at', 'updated_at', 'title'];
    const allowedOrder = ['ASC', 'DESC'];

    if (!allowedSortFields.includes(sortBy)) sortBy = 'created_at';
    if (!allowedOrder.includes(order.toUpperCase())) order = 'DESC';

    baseQuery += ` ORDER BY n.${sortBy} ${order}`; // LIMIT ? OFFSET ?`;
    // params.push(parseInt(limit), parseInt(offset));
    
    console.log(baseQuery);
    console.log(params)
    const [rows] = await db.execute(baseQuery, params);
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