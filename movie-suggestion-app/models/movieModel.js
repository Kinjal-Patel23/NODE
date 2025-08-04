// const movies = require("../data/movies");

// exports.getAllMovie = () => {
//     return movies;
// };

const movies = require("../data/movies");

exports.getAllMovie = () => {
    return movies;
};


exports.getMoviesByCategory = (category) => {
    return movies.filter(m => m.category.toLowerCase() === category.toLowerCase());
};