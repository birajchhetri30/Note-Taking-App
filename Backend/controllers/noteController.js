const {
    createNote,
    getNotesByUser,
    getNoteById,
    updateNote,
    deleteNote,
    findCategoryByName,
    createCategory,
    linkNoteCategory,
    getFilteredNotes,
    getFilteredNotesCount,
} = require('../models/noteModel');


const create = async (req, res) => {
    const userId = req.user.id;
    const { title, content, categoryIds = [] } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    console.log(categoryIds);
    const connection = await require('../db').getConnection();
    await connection.beginTransaction();

    try {
        const noteId = await createNote(connection, userId, title, content);

        // For each category
        for (const name of categoryIds) {
            let category = await findCategoryByName(connection, name, userId);
            let categoryId;

            if (category) {
                categoryId = category.id;
            } else {
                categoryId = await createCategory(connection, name, userId);
            }
            console.log(noteId, categoryId);

            await linkNoteCategory(connection, noteId, categoryId);
        }

        await connection.commit();
        res.status(201).json({ message: 'Note created', noteId });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
};

const getAll = async (req, res) => {
    const userId = req.user.id;
    let {
        categoryId,
        limit = 9,
        offset = 0,
        sortBy,
        order,
        search
    } = req.query;

    limit = parseInt(limit);
    offset = parseInt(offset);

    if (typeof categoryId === 'string') {
        categoryId = categoryId.split(',').map(id => parseInt(id)).filter(Boolean);
    } else if (!Array.isArray(categoryId)) {
        categoryId = [];
    }

    try {
        const [notes, totalCount] = await Promise.all([
            getFilteredNotes(userId, {
                categoryId,
                limit,
                offset,
                sortBy,
                order,
                search
            }),
            getFilteredNotesCount(userId, {
                categoryId, search
            })
        ]);

        const totalPages = Math.ceil(totalCount / limit);
        res.json({
            notes,
            totalCount,
            totalPages,
            currentPage: Math.floor(offset / limit) + 1,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getOne = async (req, res) => {
    const userId = req.user.id;
    const noteId = req.params.id;

    try {
        const note = await getNoteById(noteId, userId);
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const update = async (req, res) => {
    const userId = req.user.id;
    const noteId = req.params.id;
    const { title, content, categoryIds = [] } = req.body;

    if (!title) return res.status(400).json({ message: 'Title is required' });

    console.log(categoryIds);
    const connection = await require('../db').getConnection();
    await connection.beginTransaction();

    try {
        const updateRows = await updateNote(connection, noteId, userId, title, content);
        if (updateRows === 0) return res.status(404).json({ message: 'Note not found or no permission' });

        await connection.execute(
            'DELETE FROM notecategories WHERE note_id = ?',
            [noteId]
        );

        for (const name of categoryIds) {
            let category = await findCategoryByName(connection, name, userId);
            let categoryId;

            if (category) {
                categoryId = category.id;
            } else {
                categoryId = await createCategory(connection, name, userId);
            }

            await linkNoteCategory(connection, noteId, categoryId);
        }

        await connection.commit();
        console.log('Note updated');
        res.json({ message: 'Note updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
};

const remove = async (req, res) => {
    const noteId = req.params.id;
    const userId = req.user.id;

    try {
        const deleteRows = await deleteNote(noteId, userId);
        if (deleteRows === 0) return res.status(404).json({ message: 'Note not found or no permission' });
        res.json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    create,
    getAll,
    getOne,
    update,
    remove,
};