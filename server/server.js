const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB, memoryStore } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/employers', require('./routes/employerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    name: 'Local Job Portal API',
    status: 'Running',
    version: '1.0.0',
    documentation: '/api/jobs'
  });
});

// Notifications endpoint for logged in user
app.get('/api/notifications', (req, res) => {
  const userId = req.query.userId || 'u1';
  const userNotifs = memoryStore.notifications.filter(n => n.userId === userId);
  res.json(userNotifs);
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize DB Connection and launch server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Local Job Portal API running on http://localhost:${PORT}`);
    console.log(` MongoDB Mode: ${process.env.MONGODB_URI ? 'Active DB' : 'InMemory Dynamic Fallback'}`);
    console.log(`====================================================`);
  });
});
