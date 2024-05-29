// // index.mjs
import axios from 'axios';
import fastify from 'fastify';
import dotenv from 'dotenv';

import { searchContent, saveTv, saveMovie } from './lib.js';
import { db } from './db.js';
import { handleCron } from './cron.js';

const app = fastify();
dotenv.config();

const page = 1;

const getTrendingTv = async () => {
  const response = await axios.get('https://api.themoviedb.org/3/trending/tv/week', {
    params: {
      api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
      language: 'ko-KR',
    },
  });
  console.log(response.data.results);
  return response.data.results;
};

const getTrendingMovie = async () => {
  const response = await axios.get('https://api.themoviedb.org/3/trending/movie/week', {
    params: {
      api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
      language: 'ko-KR',
    },
  });
  console.log(response.data.results);
  return response.data.results;
};

const allGetContent = async () => {
  //Tv TopRated
  // for (let i = 0; i < page; i++) {
  //   const response = await axios.get('https://api.themoviedb.org/3/tv/top_rated', {
  //     params: {
  //       api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
  //       language: 'ko-KR',
  //       page: i + 1,
  //     },
  //   });
  //   //console.log(response);
  //   return response.data.results;
  // }

  //Tv Popular
  for (let i = 0; i < page; i++) {
    const response = await axios.get('https://api.themoviedb.org/3/tv/popular', {
      params: {
        api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
        language: 'ko-KR',
        page: i + 1,
      },
    });
    saveTv(response.data.results);
    return response.data.results;
  }

  //Movie TopRated
  // for (let i = 0; i < page; i++) {
  //   const response = await axios.get('https://api.themoviedb.org/3/movie/top_rated', {
  //     params: {
  //       api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
  //       language: 'ko-KR',
  //       page: i + 1,
  //     },
  //   });
  //   //console.log(response);
  //   return response.data.results;
  // }

  //Movie Popular
  // for (let i = 0; i < page; i++) {
  //   const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
  //     params: {
  //       api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
  //       language: 'ko-KR',
  //       page: i + 1,
  //     },
  //   });
  //   //console.log(response);
  //   return response.data.results;
  // }

  //Movie NowPlaying
  // for (let i = 0; i < page; i++) {
  //   const response = await axios.get(
  //     `https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=${i + 1}&region=KR`,
  //     {
  //       params: {
  //         api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
  //       },
  //     },
  //   );
  //   // console.log(response.data.results);
  //   saveMovie(response.data.results);
  //   return response.data.results;
  // }
};

//Tv : TopRated & Popular
//Movie : TopRated & Popular & NowPlaying
app.get('/all-content', async (_, reply) => {
  try {
    const result = await allGetContent();
    reply.send(result);
  } catch (err) {
    reply.status(500).send(err);
  }
});
app.get('/tv/trending', async (_, reply) => {
  try {
    const result = await getTrendingTv();
    reply.send(result);
  } catch (err) {
    reply.status(500).send(err);
  }
});
app.get('/movie/trending', async (_, reply) => {
  try {
    const result = await getTrendingMovie();
    reply.send(result);
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

// // 필요한 모듈 가져오기
// import fastify from 'fastify';
// import mongoose from 'mongoose';
// import axios from 'axios';
// import cron from 'node-cron';
// // Fastify 인스턴스 생성
// const app = fastify();

// // MongoDB 연결
// mongoose
//   .connect('mongodb+srv://kkk819:1234@cluster0.uw5n95x.mongodb.net/test', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('MongoDB에 연결되었습니다.'))
//   .catch((err) => console.error('MongoDB 연결 오류:', err));

// const movieSchema = new mongoose.Schema({
//   id: { type: Number, required: true, unique: true },
//   content_type: { type: String, require: true },
//   adult: { type: Boolean, required: false },
//   backdrop_path: { type: String, required: false },
//   genre_ids: [{ type: Number, required: false }],
//   original_language: { type: String, required: false },
//   original_title: { type: String, required: false },
//   overview: { type: String, required: false },
//   popularity: { type: Number, required: false },
//   poster_path: { type: String, required: false },
//   release_date: { type: Date, required: false },
//   title: { type: String, required: true },
//   video: { type: Boolean, required: false },
//   vote_average: { type: Number, required: false },
//   vote_count: { type: Number, required: false },
// });
// const Movie = mongoose.model('Movie', movieSchema);

// const tvSchema = new mongoose.Schema({
//   id: { type: Number, required: true, unique: true },
//   content_type: { type: String, require: true },
//   adult: { type: Boolean, required: false },
//   backdrop_path: { type: String, required: false },
//   genre_ids: [{ type: Number, required: false }],
//   original_language: { type: String, required: false },
//   original_title: { type: String, required: false },
//   overview: { type: String, required: false },
//   popularity: { type: Number, required: false },
//   poster_path: { type: String, required: false },
//   release_date: { type: Date, required: false },
//   title: { type: String, required: true }, //name
//   video: { type: Boolean, required: false },
//   vote_average: { type: Number, required: false },
//   vote_count: { type: Number, required: false },
// });
// const Tv = mongoose.model('Tv', tvSchema);

// const getSearchContents = async (searchValue) => {
//   console.log(searchValue + ' 검색 결과 입니다.');
//   const tvSearchResult = await axios.get(
//     `https://api.themoviedb.org/3/search/multi?include_adult=false&query=${searchValue}`,
//     {
//       params: {
//         api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//         language: 'ko-KR',
//       },
//     },
//   );

//   const searchContents = [...tvSearchResult.data.results];

//   if (searchContents.length === 0) {
//     console.log('검색 결과가 없습니다');
//     return;
//   }
//   console.log('검색 결과');
//   console.log('--------------------------------------');
//   for (const content of searchContents) {
//     console.log(content.title || content.name);
//   }
//   console.log('--------------------------------------');

//   for (const content of searchContents) {
//     try {
//       if (content.media_type === 'tv') {
//         const addContent = await Tv.create({
//           id: content.id,
//           contentType: 'tv',
//           adult: content.adult,
//           backdropPath: content.backdrop_path,
//           genreIds: content.genre_ids,
//           originalLanguage: content.original_language,
//           originalTitle: content.original_name,
//           overview: content.overview,
//           popularity: content.popularity,
//           posterPath: content.poster_path,
//           releaseDate: content.first_air_date,
//           title: content.name,
//           voteAverage: content.vote_average,
//           voteCount: content.vote_count,
//         });
//         console.log('TV 시리즈 ' + addContent.title + ' 추가됨');
//       }
//       if (content.media_type === 'movie') {
//         const addContent = await Movie.create({
//           id: content.id,
//           contentType: 'movie',
//           adult: content.adult,
//           backdropPath: content.backdrop_path,
//           genreIds: content.genre_ids,
//           originalLanguage: content.original_language,
//           originalTitle: content.original_name,
//           overview: content.overview,
//           popularity: content.popularity,
//           posterPath: content.poster_path,
//           releaseDate: content.first_air_date,
//           title: content.name,
//           voteAverage: content.vote_average,
//           voteCount: content.vote_count,
//         });
//         console.log('영화 ' + addContent.title + ' 추가됨');
//       }
//     } catch (error) {
//       if (error.code === 11000 && error.keyPattern && error.keyValue) {
//         console.log(
//           `중복 키 오류입니다: ${error.keyValue} 중복 된 콘텐츠는 ${
//             content.title || content.name
//           } 입니다.`,
//         );
//       } else {
//         throw error;
//       }
//     }
//   }
// };
// const getTrendingMovies = async () => {
//   const movie_week_trending = await axios.get('https://api.themoviedb.org/3/trending/movie/week', {
//     params: {
//       api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//       language: 'ko-KR',
//     },
//   });

//   movie_week_trending.data.results.map(async (movie) => {
//     try {
//       await Movie.create({ ...movie, content_type: 'movie' });
//     } catch (error) {}
//   });

//   const movie_day_trending = await axios.get('https://api.themoviedb.org/3/trending/movie/day', {
//     params: {
//       api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//       language: 'ko-KR',
//     },
//   });

//   movie_day_trending.data.results.map(async (movie) => {
//     try {
//       await Movie.create({ ...movie, content_type: 'movie' });
//     } catch (error) {}
//   });
// };

// const getTrendingTvs = async () => {
//   const tv_day_trending = await axios.get('https://api.themoviedb.org/3/trending/tv/day', {
//     params: {
//       api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//       language: 'ko-KR',
//     },
//   });
//   tv_day_trending.data.results.map(async (tv) => {
//     try {
//       await Tv.create({
//         id: tv.id,
//         contentType: 'tv',
//         adult: tv.adult,
//         backdropPath: tv.backdrop_path,
//         genreIds: tv.genre_ids,
//         originalLanguage: tv.original_language,
//         originalTitle: tv.original_name,
//         overview: tv.overview,
//         popularity: tv.popularity,
//         posterPath: tv.poster_path,
//         releaseDate: tv.first_air_date,
//         title: tv.name,
//         voteAverage: tv.vote_average,
//         voteCount: tv.vote_count,
//       });
//     } catch (error) {}
//   });

//   const tv_week_trending = await axios.get('https://api.themoviedb.org/3/trending/tv/week', {
//     params: {
//       api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//       language: 'ko-KR',
//     },
//   });

//   tv_week_trending.data.results.map(async (tv) => {
//     try {
//       await Tv.create({
//         id: tv.id,
//         contentType: 'tv',
//         adult: tv.adult,
//         backdropPath: tv.backdrop_path,
//         genreIds: tv.genre_ids,
//         originalLanguage: tv.original_language,
//         originalTitle: tv.original_name,
//         overview: tv.overview,
//         popularity: tv.popularity,
//         posterPath: tv.poster_path,
//         releaseDate: tv.first_air_date,
//         title: tv.name,
//         voteAverage: tv.vote_average,
//         voteCount: tv.vote_count,
//       });
//     } catch (error) {}
//   });
// };

// const getPopularAndTopRatedMovies = async () => {
//   for (let i = 0; i < 499; i++) {
//     const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
//       params: {
//         api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//         language: 'ko-KR',
//         page: i + 1,
//       },
//     });

//     const movies = [...response.data.results];

//     movies.map(async (content) => {
//       try {
//         await Movie.create({
//           id: content.id,
//           contentType: 'movie',
//           adult: content.adult,
//           backdropPath: content.backdrop_path,
//           genreIds: content.genre_ids,
//           originalLanguage: content.original_language,
//           originalTitle: content.original_name,
//           overview: content.overview,
//           popularity: content.popularity,
//           posterPath: content.poster_path,
//           releaseDate: content.first_air_date,
//           title: content.name,
//           voteAverage: content.vote_average,
//           voteCount: content.vote_count,
//         });
//       } catch (error) {}
//     });
//   }

//   for (let i = 0; i < 499; i++) {
//     const response = await axios.get('https://api.themoviedb.org/3/movie/top_rated', {
//       params: {
//         api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//         language: 'ko-KR',
//         page: i + 1,
//       },
//     });

//     const movies = [...response.data.results];
//     if (movies.length === 0) break;
//     movies.map(async (content) => {
//       try {
//         await Movie.create({
//           id: content.id,
//           contentType: 'movie',
//           adult: content.adult,
//           backdropPath: content.backdrop_path,
//           genreIds: content.genre_ids,
//           originalLanguage: content.original_language,
//           originalTitle: content.original_name,
//           overview: content.overview,
//           popularity: content.popularity,
//           posterPath: content.poster_path,
//           releaseDate: content.first_air_date,
//           title: content.name,
//           voteAverage: content.vote_average,
//           voteCount: content.vote_count,
//         });
//       } catch (error) {}
//     });
//   }
// };

// const getPopularAndTopRatedTvs = async () => {
//   for (let i = 0; i < 499; i++) {
//     const response = await axios.get('https://api.themoviedb.org/3/tv/popular', {
//       params: {
//         api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//         language: 'ko-KR',
//         page: i + 1,
//       },
//     });

//     const tvs = [...response.data.results];

//     tvs.map(async (tv) => {
//       try {
//         await Tv.create({
//           id: tv.id,
//           contentType: 'tv',
//           adult: tv.adult,
//           backdropPath: tv.backdrop_path,
//           genreIds: tv.genre_ids,
//           originalLanguage: tv.original_language,
//           originalTitle: tv.original_name,
//           overview: tv.overview,
//           popularity: tv.popularity,
//           posterPath: tv.poster_path,
//           releaseDate: tv.first_air_date,
//           title: tv.name,
//           voteAverage: tv.vote_average,
//           voteCount: tv.vote_count,
//         });
//       } catch (error) {}
//     });
//   }

//   for (let i = 0; i < 499; i++) {
//     const response = await axios.get('https://api.themoviedb.org/3/tv/top_rated', {
//       params: {
//         api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//         language: 'ko-KR',
//         page: i + 1,
//       },
//     });

//     const tvs = [...response.data.results];

//     if (tvs.length === 0) break;

//     tvs.map(async (tv) => {
//       try {
//         await Tv.create({
//           id: tv.id,
//           contentType: 'tv',
//           adult: tv.adult,
//           backdropPath: tv.backdrop_path,
//           genreIds: tv.genre_ids,
//           originalLanguage: tv.original_language,
//           originalTitle: tv.original_name,
//           overview: tv.overview,
//           popularity: tv.popularity,
//           posterPath: tv.poster_path,
//           releaseDate: tv.first_air_date,
//           title: tv.name,
//           voteAverage: tv.vote_average,
//           voteCount: tv.vote_count,
//         });
//       } catch (error) {}
//     });
//   }
// };

// const getNowPlayMovies = async () => {
//   for (let i = 0; i < 500; i++) {
//     const response = await axios.get(
//       `https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=${i + 1}&region=KR`,
//       {
//         params: {
//           api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//           // language: 'ko-KR',
//         },
//       },
//     );
//     const movies = [...response.data.results];
//     console.log('검색 결과');
//     console.log('--------------------------------------');
//     for (const movie of movies) {
//       console.log(movie.title);
//     }
//     console.log('--------------------------------------');
//     for (const content of movies) {
//       try {
//         const addContent = await Movie.create({ ...content, content_type: 'movie' });
//         console.log('영화 ' + addContent.title + ' 추가됨');
//       } catch (error) {
//         if (error.code === 11000 && error.keyPattern && error.keyValue) {
//           console.log(
//             `중복 키 오류입니다: ${error.keyValue} 중복 된 콘텐츠는 ${
//               content.title || content.name
//             } 입니다.`,
//           );
//         } else {
//           throw error;
//         }
//       }
//     }
//     if (movies) break;
//   }
//   console.log('요청 중단');
// };

// const handleCron = () => {
//   console.log('handleCron 접근');
//   const end_point = 'http://localhost:8000/movie/now_playing';
//   cron.schedule(
//     '* * * * *',
//     async () => {
//       try {
//         const response = await axios.get(end_point);
//         console.log(end_point, '로의 HTTP 요청이 성공적으로 보내졌습니다.', response.data);
//       } catch (error) {
//         console.log(error);
//       }
//     },
//     {
//       scheduled: true, // cron 작업이 활성화되도록 설정
//       timezone: 'Asia/Seoul', // 시간대 설정 (원하는 시간대로 변경)
//     },
//   );
// };

// // Fastify 라우트 정의
// app.get('/tv/top_pop_trend', async (request, reply) => {
//   try {
//     await Promise.all([getTrendingTvs(), getPopularAndTopRatedTvs()]);

//     console.log('순위권, 트렌드 티비 시리즈를 모두 불러왔습니다.');
//     reply.send('순위권, 트렌드 티비 시리즈를 모두 불러왔습니다.');
//   } catch (err) {
//     reply.status(500).send(err);
//   }
// });
// app.get('/movie/top_pop_trend', async (request, reply) => {
//   try {
//     await Promise.all([getTrendingMovies(), getPopularAndTopRatedMovies()]);
//     console.log('순위권, 트렌드 영화를 모두 불러왔습니다.');
//     reply.send('순위권, 트렌드 영화를 모두 불러왔습니다.');
//   } catch (err) {
//     reply.status(500).send(err);
//   }
// });
// app.get('/movie/now_playing', async (request, reply) => {
//   try {
//     await Promise.all([getNowPlayMovies()]);
//     console.log('상영중인 영화 목록을 모두 불러왔습니다');
//     reply.send('상영중인 영화 목록을 모두 불러왔습니다');
//   } catch (err) {
//     reply.status(500).send(err);
//   }
// });
// app.get('/search/:searchValue', async (request, reply) => {
//   const { searchValue } = request.params;
//   try {
//     await Promise.all([getSearchContents(searchValue)]);
//     reply.send(searchValue + ' 검색 완료');
//   } catch (error) {
//     reply.status(500).send(error);
//   }
// });

// app.get('/all_content', async (request, reply) => {
//   reply.send('모든 콘텐츠 불러오기 시작');
//   await Promise.all([getTrendingTvs(), getPopularAndTopRatedTvs()]);
//   console.log('순위권, 트렌드 티비 시리즈를 모두 불러왔습니다.');
//   reply.send('순위권, 트렌드 티비 시리즈를 모두 불러왔습니다.');
//   await Promise.all([getTrendingMovies(), getPopularAndTopRatedMovies()]);
//   console.log('순위권, 트렌드 영화를 모두 불러왔습니다.');
//   reply.send('순위권, 트렌드 영화를 모두 불러왔습니다.');
//   await Promise.all([getNowPlayMovies()]);
//   console.log('상영중인 영화 목록을 모두 불러왔습니다');
//   reply.send('상영중인 영화 목록을 모두 불러왔습니다');
// });

// const start = async () => {
//   try {
//     await app.listen(8000);
//     console.log('서버가 정상적으로 시작되었습니다.');
//     // handleCron();
//   } catch (err) {
//     console.error('서버 시작 오류:', err);
//     process.exit(1);
//   }
// };
// start();

// prev

// import fastify from 'fastify';
// import mongoose from 'mongoose';
// import axios from 'axios';
// import cron from 'node-cron';
// import { Content } from './schema/Content';

// // Fastify 인스턴스 생성
// const app = fastify();

// // MongoDB 연결
// mongoose

//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('MongoDB에 연결되었습니다.'))
//   .catch((err) => console.error('MongoDB 연결 오류:', err));

// const movieSchema = new mongoose.Schema({
//   id: { type: Number, required: true, unique: true },
//   content_type: { type: String, require: true },
//   adult: { type: Boolean, required: false },
//   backdrop_path: { type: String, required: false },
//   genre_ids: [{ type: Number, required: false }],
//   original_language: { type: String, required: false },
//   original_title: { type: String, required: false },
//   overview: { type: String, required: false },
//   popularity: { type: Number, required: false },
//   poster_path: { type: String, required: false },
//   release_date: { type: Date, required: false },
//   title: { type: String, required: true },
//   video: { type: Boolean, required: false },
//   vote_average: { type: Number, required: false },
//   vote_count: { type: Number, required: false },
// });
// const Movie = mongoose.model('Movie', movieSchema);

// const tvSchema = new mongoose.Schema({
//   id: { type: Number, required: true, unique: true },
//   content_type: { type: String, require: true },
//   adult: { type: Boolean, required: false },
//   backdrop_path: { type: String, required: false },
//   genre_ids: [{ type: Number, required: false }],
//   original_language: { type: String, required: false },
//   original_title: { type: String, required: false },
//   overview: { type: String, required: false },
//   popularity: { type: Number, required: false },
//   poster_path: { type: String, required: false },
//   release_date: { type: Date, required: false },
//   title: { type: String, required: true }, //name
//   video: { type: Boolean, required: false },
//   vote_average: { type: Number, required: false },
//   vote_count: { type: Number, required: false },
// });
// const Tv = mongoose.model('Tv', tvSchema);

// const getSearchContents = async (searchValue) => {
//   console.log(searchValue + ' 검색 결과 입니다.');
//   const tvSearchResult = await axios.get(
//     `https://api.themoviedb.org/3/search/multi?include_adult=false&query=${searchValue}`,
//     {
//       params: {
//         api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//         language: 'ko-KR',
//       },
//     },
//   );

//   const searchContents = [...tvSearchResult.data.results];

//   if (searchContents.length === 0) {
//     console.log('검색 결과가 없습니다');
//     return;
//   }
//   console.log('검색 결과');
//   console.log('--------------------------------------');
//   for (const content of searchContents) {
//     console.log(content.title || content.name);
//   }
//   console.log('--------------------------------------');

//   for (const content of searchContents) {
//     try {
//       if (content.media_type === 'tv') {
//         const addContent = await Tv.create({
//           id: content.id,
//           content_type: 'tv',
//           adult: content.adult,
//           backdrop_path: content.backdrop_path,
//           genre_ids: content.genre_ids,
//           original_language: content.original_language,
//           original_title: content.original_name,
//           overview: content.overview,
//           popularity: content.popularity,
//           poster_path: content.poster_path,
//           release_date: content.first_air_date,
//           title: content.name,
//           vote_average: content.vote_average,
//           vote_count: content.vote_count,
//         });
//         console.log('TV 시리즈 ' + addContent.title + ' 추가됨');
//       }
//       if (content.media_type === 'movie') {
//         const addContent = await Movie.create({ ...content, content_type: 'movie' });
//         console.log('영화 ' + addContent.title + ' 추가됨');
//       }
//     } catch (error) {
//       if (error.code === 11000 && error.keyPattern && error.keyValue) {
//         console.log(
//           `중복 키 오류입니다: ${error.keyValue} 중복 된 콘텐츠는 ${
//             content.title || content.name
//           } 입니다.`,
//         );
//       } else {
//         throw error;
//       }
//     }
//   }
// };

// const getTrendingMovies = async () => {
//   const movie_week_trending = await axios.get('https://api.themoviedb.org/3/trending/movie/week', {
//     params: {
//       api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//       language: 'ko-KR',
//     },
//   });

//   movie_week_trending.data.results.map(async (movie) => {
//     try {
//       await Movie.create({ ...movie, content_type: 'movie' });
//     } catch (error) {}
//   });

//   const movie_day_trending = await axios.get('https://api.themoviedb.org/3/trending/movie/day', {
//     params: {
//       api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//       language: 'ko-KR',
//     },
//   });

//   movie_day_trending.data.results.map(async (movie) => {
//     try {
//       await Movie.create({ ...movie, content_type: 'movie' });
//     } catch (error) {}
//   });

//   console.log('영화 트렌딩 끝');
// };

// const getTrendingTvs = async () => {
//   const tv_day_trending = await axios.get('https://api.themoviedb.org/3/trending/tv/day', {
//     params: {
//       api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//       language: 'ko-KR',
//     },
//   });
//   tv_day_trending.data.results.map(async (tv) => {
//     try {
//       await Tv.create({
//         id: tv.id,
//         content_type: 'tv',
//         adult: tv.adult,
//         backdrop_path: tv.backdrop_path,
//         genre_ids: tv.genre_ids,
//         original_language: tv.original_language,
//         original_title: tv.original_name,
//         overview: tv.overview,
//         popularity: tv.popularity,
//         poster_path: tv.poster_path,
//         release_date: tv.first_air_date,
//         title: tv.name,
//         vote_average: tv.vote_average,
//         vote_count: tv.vote_count,
//       });
//     } catch (error) {}
//   });

//   const tv_week_trending = await axios.get('https://api.themoviedb.org/3/trending/tv/week', {
//     params: {
//       api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//       language: 'ko-KR',
//     },
//   });

//   tv_week_trending.data.results.map(async (tv) => {
//     try {
//       await Tv.create({
//         id: tv.id,
//         content_type: 'tv',
//         adult: tv.adult,
//         backdrop_path: tv.backdrop_path,
//         genre_ids: tv.genre_ids,
//         original_language: tv.original_language,
//         original_title: tv.original_name,
//         overview: tv.overview,
//         popularity: tv.popularity,
//         poster_path: tv.poster_path,
//         release_date: tv.first_air_date,
//         title: tv.name,
//         vote_average: tv.vote_average,
//         vote_count: tv.vote_count,
//       });
//     } catch (error) {}
//   });

//   console.log('TV시리즈 트렌딩 끝');
// };

// const getPopularAndTopRatedMovies = async () => {
//   for (let i = 0; i < 499; i++) {
//     const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
//       params: {
//         api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//         language: 'ko-KR',
//         page: i + 1,
//       },
//     });

//     const movies = [...response.data.results];

//     movies.map(async (movie) => {
//       try {
//         await Movie.create({ ...movie, content_type: 'movie' });
//       } catch (error) {}
//     });
//   }

//   for (let i = 0; i < 499; i++) {
//     const response = await axios.get('https://api.themoviedb.org/3/movie/top_rated', {
//       params: {
//         api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//         language: 'ko-KR',
//         page: i + 1,
//       },
//     });

//     const movies = [...response.data.results];
//     if (movies.length === 0) break;
//     movies.map(async (movie) => {
//       try {
//         await Movie.create({ ...movie, content_type: 'movie' });
//       } catch (error) {}
//     });
//   }
// };

// const getPopularAndTopRatedTvs = async () => {
//   for (let i = 0; i < 499; i++) {
//     const response = await axios.get('https://api.themoviedb.org/3/tv/popular', {
//       params: {
//         api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//         language: 'ko-KR',
//         page: i + 1,
//       },
//     });

//     const tvs = [...response.data.results];

//     tvs.map(async (tv) => {
//       try {
//         await Tv.create({
//           id: tv.id,
//           content_type: 'tv',
//           adult: tv.adult,
//           backdrop_path: tv.backdrop_path,
//           genre_ids: tv.genre_ids,
//           original_language: tv.original_language,
//           original_title: tv.original_name,
//           overview: tv.overview,
//           popularity: tv.popularity,
//           poster_path: tv.poster_path,
//           release_date: tv.first_air_date,
//           title: tv.name,
//           vote_average: tv.vote_average,
//           vote_count: tv.vote_count,
//         });
//       } catch (error) {}
//     });
//   }

//   for (let i = 0; i < 499; i++) {
//     const response = await axios.get('https://api.themoviedb.org/3/tv/top_rated', {
//       params: {
//         api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//         language: 'ko-KR',
//         page: i + 1,
//       },
//     });

//     const tvs = [...response.data.results];

//     if (tvs.length === 0) break;

//     tvs.map(async (tv) => {
//       try {
//         await Tv.create({
//           id: tv.id,
//           content_type: 'tv',
//           adult: tv.adult,
//           backdrop_path: tv.backdrop_path,
//           genre_ids: tv.genre_ids,
//           original_language: tv.original_language,
//           original_title: tv.original_name,
//           overview: tv.overview,
//           popularity: tv.popularity,
//           poster_path: tv.poster_path,
//           release_date: tv.first_air_date,
//           title: tv.name,
//           vote_average: tv.vote_average,
//           vote_count: tv.vote_count,
//         });
//       } catch (error) {}
//     });
//   }
// };

// const getNowPlayMovies = async () => {
//   for (let i = 0; i < 500; i++) {
//     const response = await axios.get(
//       `https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=${i + 1}&region=KR`,
//       {
//         params: {
//           api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
//           // language: 'ko-KR',
//         },
//       },
//     );
//     const movies = [...response.data.results];
//     console.log('검색 결과');
//     console.log('--------------------------------------');
//     for (const movie of movies) {
//       console.log(movie.title);
//     }
//     console.log('--------------------------------------');
//     for (const content of movies) {
//       try {
//         const addContent = await Movie.create({ ...content, content_type: 'movie' });
//         console.log('영화 ' + addContent.title + ' 추가됨');
//       } catch (error) {
//         if (error.code === 11000 && error.keyPattern && error.keyValue) {
//           console.log(
//             `중복 키 오류입니다: ${error.keyValue} 중복 된 콘텐츠는 ${
//               content.title || content.name
//             } 입니다.`,
//           );
//         } else {
//           throw error;
//         }
//       }
//     }
//     if (movies) break;
//   }
//   console.log('요청 중단');
// };

// const handleCron = () => {
//   console.log('handleCron 접근');
//   const end_point = 'http://localhost:8000/movie/now_playing';
//   cron.schedule(
//     '* * * * *',
//     async () => {
//       try {
//         const response = await axios.get(end_point);
//         console.log(end_point, '로의 HTTP 요청이 성공적으로 보내졌습니다.', response.data);
//       } catch (error) {
//         console.log(error);
//       }
//     },
//     {
//       scheduled: true, // cron 작업이 활성화되도록 설정
//       timezone: 'Asia/Seoul', // 시간대 설정 (원하는 시간대로 변경)
//     },
//   );
// };

// // Fastify 라우트 정의
// app.get('/tv/top_pop_trend', async (request, reply) => {
//   try {
//     await Promise.all([getTrendingTvs(), getPopularAndTopRatedTvs()]);

//     console.log('순위권, 트렌드 티비 시리즈를 모두 불러왔습니다.');
//     reply.send('순위권, 트렌드 티비 시리즈를 모두 불러왔습니다.');
//   } catch (err) {
//     reply.status(500).send(err);
//   }
// });
// app.get('/movie/top_pop_trend', async (request, reply) => {
//   try {
//     await Promise.all([getTrendingMovies(), getPopularAndTopRatedMovies()]);
//     console.log('순위권, 트렌드 영화를 모두 불러왔습니다.');
//     reply.send('순위권, 트렌드 영화를 모두 불러왔습니다.');
//   } catch (err) {
//     reply.status(500).send(err);
//   }
// });
// app.get('/movie/now_playing', async (request, reply) => {
//   try {
//     await Promise.all([getNowPlayMovies()]);
//     console.log('상영중인 영화 목록을 모두 불러왔습니다');
//     reply.send('상영중인 영화 목록을 모두 불러왔습니다');
//   } catch (err) {
//     reply.status(500).send(err);
//   }
// });
// app.get('/search/:searchValue', async (request, reply) => {
//   const { searchValue } = request.params;
//   try {
//     await Promise.all([getSearchContents(searchValue)]);
//     reply.send(searchValue + ' 검색 완료');
//   } catch (error) {
//     reply.status(500).send(error);
//   }
// });

// const start = async () => {
//   try {
//     await app.listen(8000);
//     console.log('서버가 정상적으로 시작되었습니다.');
//     handleCron();
//   } catch (err) {
//     console.error('서버 시작 오류:', err);
//     process.exit(1);
//   }
// };
// start();
