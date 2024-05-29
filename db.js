import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const db = () =>
  mongoose
    .connect(process.env.MONGODB_URL, {})
    .then(() => console.log('MongoDB에 연결되었습니다.'))
    .catch((err) => console.error('MongoDB 연결 오류:', err));
