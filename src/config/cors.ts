import cors from 'cors';
import { env } from './env';

export const corsConfig = cors({
    origin: env.FRONTEND_URL,
    credentials: true,
})