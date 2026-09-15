import cron from 'node-cron';
import { EmailProducerService } from '../services/email.producer.service';

export function initCronJobs() {
  console.log('🕒 Initializing cron jobs...');
  // Run every 1 minute
  cron.schedule('* * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running scheduled EmailProducerService.processConcerns...`);
    try {
      await EmailProducerService.processConcerns();
      console.log(`[${new Date().toISOString()}] Cron job processConcerns completed.`);
    } catch (error) {
      console.error('Error during scheduled concern processing:', error);
    }
  });
}
