/*
Challenge 3

"Factorial Chain"

The function factorialChain accepts two arguments: length and lastDigits.

The length tells you how many numbers to include in the series, and your job is to calculate the factorial of each number from 1 to length, then sum all those factorials.

lastDigits indicates how many digits from the end of the final sum should be returned, as a string.

Example:

factorialChain(5, 3); // Expected output: "153"
factorialChain(5, 1); // Expected output: "3
factorialChain(5,5); // Expected output: "00153"

1! = 1  
2! = 2  
3! = 6  
4! = 24  
5! = 120  
Total = 153 

Requirements:
- The function should accept two positive integers.
- The first integer (length) should represent the number of terms in the series.
- The second integer (lastDigits) should represent how many digits from the end of the final sum should be returned.
- The function should return the lastDigits digits of the sum as a string.
- In case the sum has fewer digits than lastDigits, the function should return the sum padded with leading zeros to match the length of lastDigits.

*/

const factorialChain = (number, lastDigits) => {

    let totalSumFactorial = 0;
    let currentFactorial = 1;

    for (let i = 1; i <= number; i++) {
        currentFactorial *= i;
        totalSumFactorial += currentFactorial;
    }

    const totalSumFactorialStr = totalSumFactorial.toString()

    if (lastDigits > totalSumFactorialStr.length) {
        result = totalSumFactorialStr.padStart(lastDigits, "0")
    } else {
        result = totalSumFactorialStr.slice(-lastDigits)
    }

    return result
};


module.exports = factorialChain;
