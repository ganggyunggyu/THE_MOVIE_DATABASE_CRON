import axios from 'axios';
import { Content } from './schema/Content.js';

export const searchContent = async (searchValue) => {
  console.log(`${searchValue} 검색 결과 입니다.`);

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/multi?include_adult=false&query=${searchValue}`,
      {
        params: {
          api_key: process.env.TMDB_KEY, // 여기에 발급받은 API 키를 넣어주세요
          language: 'ko-KR',
        },
      },
    );

    const searchContents = [...response.data.results];

    if (searchContents.length === 0) {
      console.log('검색 결과가 없습니다');
      return;
    }

    console.log('검색 결과');
    console.log('--------------------------------------');
    searchContents.forEach((v) => {
      console.log(v.title || v.name);
    });
    console.log('--------------------------------------');

    await saveContent(searchContents);
  } catch (err) {
    console.error('검색 중 오류 발생:', err);
  }
};

export const saveMovie = async (movies) => {
  for (const content of movies) {
    try {
      await Content.create({
        id: content.id,
        contentType: 'movie',
        adult: content.adult,
        backdropPath: content.backdrop_path,
        genreIds: content.genre_ids,
        originalLanguage: content.original_language,
        originalTitle: content.original_title,
        overview: content.overview,
        popularity: content.popularity,
        posterPath: content.poster_path,
        releaseDate: content.release_date,
        title: content.title,
        voteAverage: content.vote_average,
        voteCount: content.vote_count,
      });
    } catch (error) {
      if (error.code === 11000 && error.keyPattern && error.keyValue) {
        // console.log(`중복 키 오류입니다. 중복 된 콘텐츠는 ${content.title} 입니다.`);
      } else {
        throw error;
      }
    }
  }
};

export const saveTv = async (tvs) => {
  for (const content of tvs) {
    try {
      await Content.create({
        id: content.id,
        contentType: 'tv',
        adult: content.adult,
        backdropPath: content.backdrop_path,
        genreIds: content.genre_ids,
        originalLanguage: content.original_language,
        originalTitle: content.original_name,
        overview: content.overview,
        popularity: content.popularity,
        posterPath: content.poster_path,
        releaseDate: content.first_air_date,
        title: content.name,
        voteAverage: content.vote_average,
        voteCount: content.vote_count,
      });
    } catch (error) {
      if (error.code === 11000 && error.keyPattern && error.keyValue) {
        // console.log(`중복 키 오류입니다. 중복 된 콘텐츠는 ${content.name} 입니다.`);
      } else {
        console.error(error);
        throw error;
      }
    }
  }
};

export const saveContent = async (contents) => {
  for (const content of contents) {
    if (content.media_type === 'movie') {
      try {
        await Content.create({
          id: content.id,
          contentType: 'movie',
          adult: content.adult,
          backdropPath: content.backdrop_path,
          genreIds: content.genre_ids,
          originalLanguage: content.original_language,
          originalTitle: content.original_title,
          overview: content.overview,
          popularity: content.popularity,
          posterPath: content.poster_path,
          releaseDate: content.release_date,
          title: content.title,
          voteAverage: content.vote_average,
          voteCount: content.vote_count,
        });
      } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
          console.log(`중복 키 오류입니다. 중복 된 콘텐츠는 ${content.title} 입니다.`);
        } else {
          throw error;
        }
      }
    } else if (content.media_type === 'tv') {
      try {
        await Content.create({
          id: content.id,
          contentType: 'tv',
          adult: content.adult,
          backdropPath: content.backdrop_path,
          genreIds: content.genre_ids,
          originalLanguage: content.original_language,
          originalTitle: content.original_name,
          overview: content.overview,
          popularity: content.popularity,
          posterPath: content.poster_path,
          releaseDate: content.first_air_date,
          title: content.name,
          voteAverage: content.vote_average,
          voteCount: content.vote_count,
        });
      } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
          console.log(`중복 키 오류입니다. 중복 된 콘텐츠는 ${content.name} 입니다.`);
        } else {
          throw error;
        }
      }
    }
  }
};
