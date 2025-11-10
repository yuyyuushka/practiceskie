const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { checkPermission, checkRole } = require('../middleware/roles');
const router = express.Router();

router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    message: 'Profile data',
    user: req.user
  });
});

router.get('/user-data', 
  authenticateToken, 
  checkRole(['user', 'admin']),
  (req, res) => {
    res.json({ message: 'User-specific data' });
  }
);

router.get('/admin/users',
  authenticateToken,
  checkRole(['admin']),
  async (req, res) => {
    res.json({ message: 'Admin users list' });
  }
);

router.delete('/users/:id',
  authenticateToken,
  checkPermission('delete_any_data'),
  (req, res) => {
    res.json({ message: 'User deleted successfully' });
  }
);

router.put('/users/:id',
  authenticateToken,
  checkRole(['admin']),
  checkPermission('write_any_data'),
  (req, res) => {
    res.json({ message: 'User updated successfully' });
  }
);

module.exports = router;