const dotenv = require('dotenv');
const connectDB = require('./db/mongoose');
const app = require('./app');
const config = require('./config/config');

dotenv.config();

const PORT = process.env.PORT || 3000;

const HOST = process.env.HOST || 'localhost';

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, HOST, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start the server:', error);
  }
};

startServer();
