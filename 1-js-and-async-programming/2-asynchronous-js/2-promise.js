/*
  Challenge 2: Users Who Dislike More Movies Than They Like

  Get a list of users who have rated more movies negatively than positively.

  Use the methods in utils/mocked-api to retrieve user and rating data.
  Check how many movies each user liked and disliked, then return only those with more dislikes.

  Requirements:
  - Use only Promise static methods (e.g., Promise.all, Promise.then, etc.) to handle the results
  - Only print the user information in the output—no extra text or formatting

 */

//I added getUsers() here, cuz i need to get the users data
const {
  getLikedMovies,
  getDislikedMovies,
  getUsers,
} = require("./utils/mocked-api");

/**
 * @typedef {Object} User
 * @property {number} id - The unique identifier for the user.
 * @property {string} name - The name of the user.
 * @property {number} age - The age of the user.
 */

/**
 * Logs and returns the users who dislike more movies than they like.
 *
 * @returns {Promise<User[]>} A promise that resolves to an array of users who dislike more movies than they like.
 */
const getUsersWithMoreDislikedMoviesThanLikedMovies = () => {
  let usersWhoDislikeMore = [];
  // Add your code here
  const usersPromise = getUsers();
  const likedMoviesPromise = getLikedMovies();
  const dislikedMoviesPromise = getDislikedMovies();

  const allPromises = Promise.all([
    usersPromise,
    likedMoviesPromise,
    dislikedMoviesPromise,
  ]);

  return allPromises
    .then((values) => {
      const users = values[0];
      const likedMovies = values[1];
      const dislikedMovies = values[2];

      users.forEach((user) => {
        const userLiked = likedMovies.find((item) => item.userId === user.id);
        const userDisliked = dislikedMovies.find((item) => item.userId === user.id,);

        const likedCount = userLiked ? userLiked.movies.length : 0;
        const dislikedCount = userDisliked ? userDisliked.movies.length : 0;

        if (dislikedCount > likedCount) {
          usersWhoDislikeMore.push(user);
        }
      });

      return usersWhoDislikeMore;
    })
    .catch((error) => {
      console.log(error);
    });
};

//added user.age instead of age
getUsersWithMoreDislikedMoviesThanLikedMovies().then((users) => {
  console.log("Users with more disliked movies than liked movies:");
  users.forEach((user) => {
    console.log(`${user.name} - ${user.age} años`);
  });
});

module.exports = {
  getUsersWithMoreDislikedMoviesThanLikedMovies,
};
