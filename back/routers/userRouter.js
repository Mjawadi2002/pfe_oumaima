const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser
} = require('../controllers/userController');

const authenticateToken = require('../middleware/authMiddleware');

// Public routes
router.post('/', createUser);
router.post('/login', loginUser);

// Protected routes (only accessible if logged in)
router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;
