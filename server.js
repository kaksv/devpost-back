const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const statsRouter = require('./routes/statsRoute');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hackathons', require('./routes/hackathonRoutes')); // Add hackathon routes
app.use('/api/stats', statsRouter); // Add project routes

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});