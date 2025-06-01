const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {createUser, findUserByEmail, findUserById} = require('../models/userModel');

const register = async (req, res) => {
    const {name, email, password} = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({message: 'Name is required'});
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({message: 'Valid email is required'});
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({
            message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
        });
    } 

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

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({message: 'Valid email is required'})
    }

    if (!password) {
        return res.status(400).json({message: 'Password is required'});
    }
    
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

const getProfile = async (req, res) => {
    try {
        const user = await findUserById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});
        res.json(user);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

module.exports = {
    register,
    login,
    getProfile
};