import 'dotenv/config';
import app from './app';
import { initDataSource } from './database/db';
import { initCronJobs } from './cron';

const PORT = parseInt(process.env.PORT || '3000', 10);

initDataSource().then(() => {
  initCronJobs();
  app.listen(PORT, () => {
    console.log(`🚀  Orah API running at http://localhost:${PORT}`);
    console.log(`📖  Swagger docs at  http://localhost:${PORT}/api-docs`);
  });
}).catch((error) => {
  console.error('Error during Data Source initialization:', error);
});
