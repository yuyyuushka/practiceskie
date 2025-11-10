const express = require('express');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api', protectedRoutes);

app.get('/api/dashboard', 
  authenticateToken, 
  (req, res) => {
    res.json({ 
      message: 'Dashboard data',
      user: req.user 
    });
  }
);