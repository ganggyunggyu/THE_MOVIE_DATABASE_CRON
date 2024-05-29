import axios from 'axios';
import fastify from 'fastify';
import dotenv from 'dotenv';

import { searchContent, saveTv, saveMovie } from './lib.js';
import { db } from './db.js';
import { handleCron } from './cron.js';

const app = fastify();
dotenv.config();

const page = 1000;

const getTrendingTv = async () => {
  const response = await axios.get('https://api.themoviedb.org/3/trending/tv/week', {
    params: {
      api_key: process.env.TMDB_KEY,
      language: 'ko-KR',
    },
  });
  saveTv(response.data.results);
  return response.data.results;
};

const getTrendingMovie = async () => {
  const response = await axios.get('https://api.themoviedb.org/3/trending/movie/week', {
    params: {
      api_key: process.env.TMDB_KEY,
      language: 'ko-KR',
    },
  });
  saveMovie(response.data.results);
  return response.data.results;
};

const getAiringTodayTv = async () => {
  for (let i = 0; i < page; i++) {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/tv/top_rated', {
        params: {
          api_key: process.env.TMDB_KEY,
          language: 'ko-KR',
          page: i + 1,
        },
      });
      if (response.data.results.length === 0) {
        console.log(`Tv Airing Tv Show ${i + 1}번까지 요청 완료`);
        return;
      }
      saveTv(response.data.results);
      console.log(`TV Airing Tv Show ${i + 1}`);
      // return response.data.results;
    } catch (error) {
      break;
    }
  }
};

const allGetContent = async () => {
  //Tv Airing Tv Show
  for (let i = 0; i < page; i++) {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/tv/top_rated', {
        params: {
          api_key: process.env.TMDB_KEY,
          language: 'ko-KR',
          page: i + 1,
        },
      });
      if (response.data.results.length === 0) {
        console.log(`Tv Airing Tv Show ${i + 1}번까지 요청 완료`);
        break;
      }
      saveTv(response.data.results);
      console.log(`TV Airing Tv Show ${i + 1}`);
      console.log(`${response.data.results.length}개 요청`);
      // return response.data.results;
    } catch (error) {
      break;
    }
  }

  //Tv TopRated
  for (let i = 0; i < page; i++) {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/tv/top_rated', {
        params: {
          api_key: process.env.TMDB_KEY,
          language: 'ko-KR',
          page: i + 1,
        },
      });
      if (response.data.results.length === 0) {
        console.log(`TV Top Rated ${i + 1}번까지 요청 완료`);
        break;
      }
      saveTv(response.data.results);
      console.log(`TV Top Rated ${i + 1}`);
      console.log(`${response.data.results.length}개 요청`);
      // return response.data.results;
    } catch (error) {
      break;
    }
  }

  //Tv Popular
  for (let i = 0; i < page; i++) {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/tv/popular', {
        params: {
          api_key: process.env.TMDB_KEY,
          language: 'ko-KR',
          page: i + 1,
        },
      });
      if (response.data.results.length === 0) {
        console.log(`TV Popular ${i + 1}번까지 요청 완료`);
        break;
      }
      saveTv(response.data.results);
      console.log(`TV Popular ${i + 1}`);
      console.log(`${response.data.results.length}개 요청`);
      // return response.data.results;
    } catch (error) {
      break;
    }
  }

  //Movie TopRated
  for (let i = 0; i < page; i++) {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/movie/top_rated', {
        params: {
          api_key: process.env.TMDB_KEY,
          language: 'ko-KR',
          page: i + 1,
        },
      });
      if (response.data.results.length === 0) {
        console.log(`Movie Top Rated ${i + 1}번까지 요청 완료`);
        break;
      }
      saveMovie(response.data.results);
      console.log(`Movie Top Rated ${i + 1}`);
      console.log(`${response.data.results.length}개 요청`);
      // return response.data.results;
    } catch (error) {
      break;
    }
  }

  //Movie Popular
  for (let i = 0; i < page; i++) {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
        params: {
          api_key: process.env.TMDB_KEY,
          language: 'ko-KR',
          page: i + 1,
        },
      });
      if (response.data.results.length === 0) {
        console.log(`Movie Popular ${i + 1}번까지 요청 완료`);
        break;
      }
      saveMovie(response.data.results);
      console.log(`Movie Popular ${i + 1}`);
      console.log(`${response.data.results.length}개 요청`);
      // return response.data.results;
    } catch (error) {
      break;
    }
  }

  //Movie NowPlaying
  for (let i = 0; i < page; i++) {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=${i + 1}&region=KR`,
        {
          params: {
            api_key: process.env.TMDB_KEY,
          },
        },
      );
      if (response.data.results.length === 0) {
        console.log(`Movie NowPlaying ${i + 1}번까지 요청 완료`);
        break;
      }
      saveMovie(response.data.results);
      console.log(`Movie NowPlaying ${i + 1}`);
      console.log(`${response.data.results.length}개 요청`);
      // return response.data.results;
    } catch (error) {
      break;
    }
  }
};

//Tv : TopRated & Popular
//Movie : TopRated & Popular & NowPlaying
app.get('/all-content', async (_, reply) => {
  try {
    await Promise.all([allGetContent()]);
    reply.send('all content 완료');
  } catch (err) {
    reply.status(500).send(err);
  }
});
app.get('/tv/trending', async (_, reply) => {
  try {
    await Promise.all([getTrendingTv()]);
    reply.send(result);
  } catch (err) {
    reply.status(500).send(err);
  }
});
app.get('/movie/trending', async (_, reply) => {
  try {
    await Promise.all([getTrendingMovie()]);
    reply.send('movie trending 완료');
  } catch (err) {
    reply.status(500).send(err);
  }
});

//검색 API
app.get('/search/:searchValue', async (request, reply) => {
  const { searchValue } = request.params;
  try {
    await Promise.all([searchContent(searchValue)]);
    reply.send(searchValue + ' 검색 완료');
  } catch (error) {
    reply.status(500).send(error);
  }
});

const main = async () => {
  try {
    await app.listen({ port: 8000 });
    console.log('서버가 정상적으로 시작되었습니다.');
    handleCron();
    await db();
  } catch (err) {
    console.error('서버 시작 오류:', err);
    process.exit(1);
  }
};

main();
