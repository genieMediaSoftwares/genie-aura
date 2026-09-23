import { createBackendApp } from './app.js';
import { config } from './config/index.js';

const app = createBackendApp();
const PORT = config.port;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[GenieAura Backend] Running standalone on port ${PORT} in ${config.nodeEnv} mode`);
  console.log(`[GenieAura Backend] API Base: http://localhost:${PORT}/api/v1`);
  console.log(`[GenieAura Backend] Swagger Docs: http://localhost:${PORT}/api/docs`);
});
