const http = require('http');
const app = require('./app');
const env = require('./config/env');
const { connectDatabase } = require('./config/database');
const { initializeSocket } = require('./sockets/socketHandler');

async function bootstrap() {
  await connectDatabase(env.mongoUri);

  const server = http.createServer(app);
  initializeSocket(server);

  server.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`DONATO server running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to bootstrap server', error);
  process.exit(1);
});
