/**
 * Challenge: Create a deep clone function
 *
 * Create a function that takes an object and returns a deep clone of that object. The function should handle nested objects, arrays, and primitive types.
 *
 * Requirements:
 * - The function should accept an object of any type.
 * - It should return a new object that is a deep clone of the original object.
 * - The function should handle nested objects and arrays.
 * - It should handle primitive types (strings, numbers, booleans, null, undefined).
 * - The function should not use any external libraries
 */

//? implement the function  here
import { complexObject } from './data/mock-data';

function deepClone<T>(input: T): T {

    //since here we are catching primitive values, it wont trigger in the first run
    if (typeof input !== 'object' || input === null || input === undefined) {
        return input
    }

    const output = (Array.isArray(input) ? [] : {}) as T

    for (const key in input) {
        output[key] = deepClone(input[key])
    }   
    
    return output
}

const clonedObject = deepClone(complexObject);

//Testing changing the property address.coordinates.lat (It's originally: 40.4168)
clonedObject.address.coordinates.lat = 0;

console.log("Original Lat:", complexObject.address.coordinates.lat);
console.log("Cloned Lat:", clonedObject.address.coordinates.lat);

//If you want to see the cloned object uncomment this console.dir()
// console.dir(clonedObject, { depth: null });