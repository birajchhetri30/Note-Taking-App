const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {createUser, findUserByEmail} = require('../models/userModel');

const register = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) return res.status(400).json({message: 'Email already in use'});

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await createUser(name, email, hashedPassword);
        res.status(201).json({message: 'User registered', userId});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(400).json({message: 'Invalid credentials'});

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({message: 'Invalid credentials'});

        const token = jwt.sign({id: user.id}, 'secret_key', {expiresIn: '1d'});
        res.json({message: 'Login successful', token});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

module.exports = {
    register,
    login
};