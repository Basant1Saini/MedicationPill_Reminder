import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import { startCronJobs, initWebPush } from './services/notificationService.js';

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  initWebPush();
  startCronJobs();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
