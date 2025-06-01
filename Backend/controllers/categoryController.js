const {
    getCategoriesByNoteId,
    getCategoriesByUserId,
    deleteCategoryById,
    deleteAllUserCategories
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

const deleteCategory = async (req, res) => {
    const categoryId = req.params.id;
    const userId = req.user.id;

    try {
        await deleteCategoryById(categoryId, userId);
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.json(500).json({ error: err.message });
    }
};

const deleteAllCategories = async (req, res) => {
    const userId = req.user.id;

    try {
        await deleteAllUserCategories(userId);
        res.json({ message: 'All user-defined categories deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getCategoriesForNote,
    getAllCategories,
    deleteCategory,
    deleteAllCategories
};