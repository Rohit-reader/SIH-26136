const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// API Routes
app.use('/api/challenges', require('./routes/challengeRoutes'));
app.use('/api/startups', require('./routes/startupRoutes'));
app.use('/api/proposals', require('./routes/proposalRoutes'));
app.use('/api/evaluations', require('./routes/evaluationRoutes'));
app.use('/api/pilots', require('./routes/pilotRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/scaleups', require('./routes/scaleUpRoutes'));
app.use('/api/audit', require('./routes/auditRoutes'));
app.use('/api/digilocker', require('./routes/digilockerRoutes'));

app.get('/', (req, res) => {
  res.send({
    message: 'GovInnovate API Service — Government of Maharashtra SIH 26136 Backend',
    status: 'Active',
    mongoDatabase: 'govinnovate_sih',
    version: '1.0.0'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`GovInnovate Express Server running on port ${PORT}`);
});
