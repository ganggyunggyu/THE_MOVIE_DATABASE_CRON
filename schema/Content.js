import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: false },
  contentType: { type: String, require: false },
  adult: { type: Boolean, required: false },
  backdropPath: { type: String, required: false },
  genreIds: [{ type: Number, required: false }],
  originalLanguage: { type: String, required: false },
  originalTitle: { type: String, required: false },
  overview: { type: String, required: false },
  popularity: { type: Number, required: false },
  posterPath: { type: String, required: false },
  releaseDate: { type: Date, required: false },
  title: { type: String, required: false },
  video: { type: Boolean, required: false },
  voteAverage: { type: Number, required: false },
  voteCount: { type: Number, required: false },
});

export const Content = mongoose.model('Content', contentSchema);

//22623
//22626
