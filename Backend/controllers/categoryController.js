const {
    getCategoriesByNoteId,
    getCategoriesByUserId
} = require('../models/categoryModel');

const getCategoriesForNote = async (req, res) => {
    const noteId = req.params.id;
    const userId = req.user.id;

    try {
        const note = await getCategoriesByNoteId(noteId, userId);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        const categories = await getCategoriesByNoteId(noteId);
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllCategories = async (req, res) => {
    const userId = req.user.id;
    try {
        const categories = await getCategoriesByUserId(userId);
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getCategoriesForNote,
    getAllCategories,
};