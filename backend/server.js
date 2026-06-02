const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');

async function start() {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`BRAHMO backend running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error);
    process.exit(1);
  }
}

start();
