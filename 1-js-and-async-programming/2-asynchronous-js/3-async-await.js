/*

  Challenge 3: Most Common Subscription for Harsh Reviewers

  Find the most common subscription among users who dislike more movies than they like.
  Use the methods in utils/mocked-api to get user and rating data.
  Check each user's likes vs. dislikes, filter those with more dislikes, and return the most frequent subscription.

  Requesites:
    - Use await with the methods from utils/mocked-api to get the data
    - Make sure to return a string containing the name of the most common subscription
*/

const {
  getUserSubscriptionByUserId,
  getLikedMovies,
  getDislikedMovies,
  getUsers,
} = require("./utils/mocked-api");

/**
 * Logs the most common subscription among users
 * who disliked more movies than they liked.
 *
 * @returns {Promise<string>} Logs the subscription name as a string.
 */
const getCommonDislikedSubscription = async () => {
  //object for storing the amount of each subscription
  let subscriptionsCounter = {};

  const [users, likedMovies, dislikedMovies] = await Promise.all([
    getUsers(),
    getLikedMovies(),
    getDislikedMovies(),
  ]);

  for (const user of users) {
    const userLikedData = likedMovies.find((item) => item.userId === user.id);
    const userDislikedData = dislikedMovies.find((item) => item.userId === user.id,);

    const likedCount = userLikedData ? userLikedData.movies.length : 0;
    const dislikedCount = userDislikedData ? userDislikedData.movies.length : 0;

    if (dislikedCount > likedCount) {
      const dataSubscription = await getUserSubscriptionByUserId(user.id);
      const subName = dataSubscription.subscription;

      subscriptionsCounter[subName] = (subscriptionsCounter[subName] || 0) + 1;
    }
  }

  let mostCommon;
  let highestNumber = 0;

  //Finding the most common
  for (const subscription in subscriptionsCounter) {
    if (subscriptionsCounter[subscription] > highestNumber) {
      highestNumber = subscriptionsCounter[subscription];
      mostCommon = subscription;
    }
  }

  return mostCommon;
};

getCommonDislikedSubscription().then((subscription) => {
  console.log("Common more dislike subscription is:", subscription);
});
