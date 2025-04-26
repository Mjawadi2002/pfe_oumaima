const express = require('express');
const router = express.Router();
const {
  getAllNodes,
  getNodeById,
  createNodeWithUsers,
  getNodesByUser,
  deleteNodeById
} = require('../controllers/nodeController');

const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllNodes);
router.get('/:id', authenticateToken, getNodeById);
router.post('/', authenticateToken, createNodeWithUsers);
router.get('/user/:userId', authenticateToken, getNodesByUser);
router.delete('/:id',authenticateToken,deleteNodeById);

module.exports = router;
