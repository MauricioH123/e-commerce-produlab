import cron from 'node-cron';
import { pool } from '../config/database.js';

cron.schedule('* * * * *', async () => {
    try{
        const result = await pool.query(`DELETE FROM idempotency_keys WHERE created_at < now() - INTERVAL '24 hours'`);
        console.log(`[cron] ${result.rowCount} idempotency keys eliminadas`);
    }catch(e){
        console.log(`[cron] Error limpiando idempotency keys`, e);
    }
})