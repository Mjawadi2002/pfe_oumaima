const con = require('../config/db');

// Get all nodes
const getAllNodes = async (req, res) => {
  try {
    const result = await con.query('SELECT * FROM nodes');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get node by ID
const getNodeById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await con.query('SELECT * FROM nodes WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Node not found' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Combined create node and associate with users
const createNodeWithUsers = async (req, res) => {
  const {
    nodeData, // Contains all node fields
    userIds   // Array of user IDs to associate
  } = req.body;

  try {
    await con.query('BEGIN');

    // Create node
    const nodeResult = await con.query(
      `INSERT INTO nodes (name, temperature, humidity, gas_level, wind_speed,
        gateway_name, gateway_ip_address, gateway_port,
        gateway_user, gateway_password)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        nodeData.name, nodeData.temperature, nodeData.humidity, 
        nodeData.gas_level, nodeData.wind_speed,
        nodeData.gateway_name, nodeData.gateway_ip_address, 
        nodeData.gateway_port, nodeData.gateway_user, 
        nodeData.gateway_password
      ]
    );

    const nodeId = nodeResult.rows[0].id;

    // Associate users
    if (userIds && userIds.length > 0) {
      for (const userId of userIds) {
        await con.query(
          'INSERT INTO user_nodes (user_id, node_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [userId, nodeId]
        );
      }
    }

    await con.query('COMMIT');

    const completeNode = await con.query(`
      SELECT n.*, array_agg(un.user_id) as user_ids 
      FROM nodes n
      LEFT JOIN user_nodes un ON n.id = un.node_id
      WHERE n.id = $1
      GROUP BY n.id
    `, [nodeId]);

    res.status(201).json(completeNode.rows[0]);
  } catch (error) {
    await con.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
};
// Get nodes for a specific user
const getNodesByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await con.query(
      `SELECT n.* FROM nodes n
       JOIN user_nodes un ON un.node_id = n.id
       WHERE un.user_id = $1`,
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete node by ID
const deleteNodeById = async (req, res) => {
  const { id } = req.params;

  try {
    await con.query('BEGIN');

    // Remove any associations in user_nodes first
    await con.query('DELETE FROM user_nodes WHERE node_id = $1', [id]);

    // Then delete the node itself
    const result = await con.query('DELETE FROM nodes WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      await con.query('ROLLBACK');
      return res.status(404).json({ message: 'Node not found' });
    }

    await con.query('COMMIT');
    res.status(200).json({ message: 'Node deleted successfully', node: result.rows[0] });
  } catch (error) {
    await con.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getAllNodes,
  getNodeById,
  createNodeWithUsers,
  getNodesByUser,
  deleteNodeById
};
