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
  const subscriptionsCounter = new Map();

  try {
    const [users, likedMovies, dislikedMovies] = await Promise.all([
      getUsers(),
      getLikedMovies(),
      getDislikedMovies(),
    ]);

    const harshReviewers = users.filter((user) => {
      const userLikedData = likedMovies.find((item) => item.userId === user.id);
      const userDislikedData = dislikedMovies.find((item) => item.userId === user.id);

      const likedCount = userLikedData ? userLikedData.movies.length : 0;
      const dislikedCount = userDislikedData ? userDislikedData.movies.length : 0;

      return dislikedCount > likedCount;
    });

    const subscriptionDataArray = await Promise.all(
      harshReviewers.map((user) => getUserSubscriptionByUserId(user.id))
    );

    subscriptionDataArray.forEach((data) => {
      const subName = data.subscription;
      subscriptionsCounter.set(subName, (subscriptionsCounter.get(subName) || 0) + 1);
    });

    let mostCommon;
    let highestNumber = 0;

    for (const [subscription, count] of subscriptionsCounter) {
      if (count > highestNumber) {
        highestNumber = count;
        mostCommon = subscription;
      }
    }

    return mostCommon;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

getCommonDislikedSubscription().then((subscription) => {
  console.log("Common more dislike subscription is:", subscription);
});
