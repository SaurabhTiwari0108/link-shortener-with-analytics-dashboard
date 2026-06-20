const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const useragent = require('express-useragent');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(useragent.express());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/link-shortener')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/urls', require('./routes/urls'));
app.use('/api/analytics', require('./routes/analytics'));

// Redirect Route
app.use('/', require('./routes/redirect'));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
