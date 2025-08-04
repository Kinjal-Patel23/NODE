// const { default: movies } = require("../data/movies");
// const movieModel = require("../models/movieModel")

// exports.getMovie = (req, res) => {
//     const movieApp = movieModel.getAllMovie();
//     res.render("home", { movieApp : movies });
// };

const movieModel = require("../models/movieModel");

exports.getMovie = (req, res) => {
    const movieApp = movieModel.getAllMovie();
    res.render("home", { movieApp });
};

exports.suggestMovie = (req, res) => {
    const category = req.params.category;
    const suggestedMovies = movieModel.getMoviesByCategory(category);
    res.render("suggest", { movies: suggestedMovies, category });
};
