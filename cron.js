import axios from 'axios';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { saveContent } from './lib.js';

dotenv.config();

// https://api.themoviedb.org/3/trending/movie/day
// https://api.themoviedb.org/3/trending/movie/week
// https://api.themoviedb.org/3/trending/tv/day
// https://api.themoviedb.org/3/trending/tv/week

const end_points = [
  'https://api.themoviedb.org/3/trending/movie/day',
  'https://api.themoviedb.org/3/trending/movie/week',
  'https://api.themoviedb.org/3/trending/tv/day',
  'https://api.themoviedb.org/3/trending/tv/week',
];

export const handleCron = () => {
  console.log('handleCron 접근');
  cron.schedule(
    '* * * * *',
    async () => {
      try {
        for (const end_point of end_points) {
          const response = await axios.get(end_point, {
            params: {
              api_key: process.env.TMDB_KEY,
              language: 'ko-KR',
            },
          });
          console.log(end_point, '로의 HTTP 요청이 성공적으로 보내졌습니다.');
          saveContent(response.data.results);
        }
      } catch (error) {
        console.log(error);
      }
    },
    {
      scheduled: true,
      timezone: 'Asia/Seoul',
    },
  );
};
