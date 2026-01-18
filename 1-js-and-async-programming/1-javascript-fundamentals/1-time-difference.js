/*
Challenge 1

"Time difference calculator"

The function timeDifference accepts two positive numbers representing time in seconds. You should modify the function to return the difference between the two times in a human-readable format HH:MM:SS.

Requirements:
- The function should accept two positive numbers representing time in seconds.
- The function should return the absolute difference between the two times.
- The result should be formatted as HH:MM:SS.

Example:

timeDifference(7200, 3400); // Expected output: "01:03:20"

*/

const timeDifference = (a, b) => {

    const differenceInSeconds = Math.abs(a - b)

    const hours = Math.floor(differenceInSeconds / 3600)
    const minutes = Math.floor((differenceInSeconds % 3600) / 60)
    const seconds = ((differenceInSeconds % 3600) % 60)

    //adding 0 before the number if needed
    const hoursNormalized = String(hours).padStart(2, '0')
    const minutesNormalized = String(minutes).padStart(2, '0')
    const secondsNormalized = String(seconds).padStart(2, '0')

    return `${hoursNormalized}:${minutesNormalized}:${secondsNormalized}`
};


module.exports = timeDifference;
