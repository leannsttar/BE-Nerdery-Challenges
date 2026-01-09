/*

  Challenge 3: Most Common Subscription for Harsh Reviewers

  Find the most common subscription among users who dislike more movies than they like.
  Use the methods in utils/mocked-api to get user and rating data.
  Check each user's likes vs. dislikes, filter those with more dislikes, and return the most frequent subscription.

  Requesites:
    - Use await with the methods from utils/mocked-api to get the data
    - Make sure to return a string containing the name of the most common subscription
*/

const { getUserSubscriptionByUserId, getLikedMovies, getDislikedMovies, getUsers } = require("./utils/mocked-api");

/**
 * Logs the most common subscription among users
 * who disliked more movies than they liked.
 *
 * @returns {Promise<string>} Logs the subscription name as a string.
 */
const getCommonDislikedSubscription = async () => {

  //object for storing the amount of each subscription
    let subscriptionsCounter = {}

    const usersPromise = getUsers()
    const likedMoviesPromise = getLikedMovies()
    const dislikedMoviesPromise = getDislikedMovies()

    const [users, likedMovies, dislikedMovies] = await Promise.all([usersPromise, likedMoviesPromise, dislikedMoviesPromise])

    for (const user of users) {
      const likedFromThisUser = likedMovies.filter((item) => item.userId === user.id)
      const dislikedFromThisUser = dislikedMovies.filter((item) => item.userId === user.id)

      if (dislikedFromThisUser[0].movies.length > likedFromThisUser[0].movies.length) {

        const dataSubscription = await getUserSubscriptionByUserId(user.id)
        //storing the times the subscription appears
        subscriptionsCounter[dataSubscription.subscription] = (subscriptionsCounter[dataSubscription.subscription] || 0) + 1
      }
    } 

    let mostCommon;
    let highestNumber = 0;

    //Finding the most common
    for (const subscription in subscriptionsCounter) {
      if (subscriptionsCounter[subscription] > highestNumber) {
        highestNumber = subscriptionsCounter[subscription]
        mostCommon = subscription
      }
    }

    return mostCommon
  
};

getCommonDislikedSubscription().then((subscription) => {
  console.log("Common more dislike subscription is:", subscription);
});
