const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const con = require('../config/db');
require('dotenv').config();


const generateToken = (user) => {
    return jwt.sign(
        { userId: user.id, userName: user.name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Get All Users
const getUsers = async (req, res) => {
    try {
        const result = await con.query('SELECT id, name, email, role FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get User By ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await con.query('SELECT id, name, email, role FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create User
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Default role to "client" if not provided
        const userRole = role && (role === 'admin' || role === 'client') ? role : 'client';

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await con.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING name, email, role',
            [name, email, hashedPassword, userRole]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Update User
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;
        const result = await con.query(
            'UPDATE users SET name=$1, email=$2, role=$3 WHERE id=$4 RETURNING id, name, email, role',
            [name, email, role, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await con.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
      const { identifier, password } = req.body;
  
      const result = await con.query(
        'SELECT * FROM users WHERE email = $1 OR name = $1',
        [identifier]
      );
  
      const user = result.rows[0];
  
      if (!user) return res.status(400).json({ message: 'Invalid email or username' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid password' });
  
      const token = generateToken(user);
      res.status(200).json({ token, user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser
};
