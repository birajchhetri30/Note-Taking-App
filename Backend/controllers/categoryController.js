const {
    getCategoriesByNoteId,
    getCategoriesByUserId
} = require('../models/categoryModel');

const getCategoriesForNote = async (req, res) => {
    const noteId = req.params.id;

    try {
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