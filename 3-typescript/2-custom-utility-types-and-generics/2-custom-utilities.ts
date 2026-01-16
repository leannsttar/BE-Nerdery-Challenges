/**
 * Exercise #1: Filter object properties by type.
 *
 * Using a utility type `OmitByType`, this example demonstrates how to pick properties
 * from a type `T` whose values are *not* assignable to a specified type `U`.
 *
 * @example
 * type OmitBoolean = OmitByType<{
 *   name: string;
 *   count: number;
 *   isReadonly: boolean;
 *   isEnable: boolean;
 * }, boolean>;
 *
 * Resulting type:
 *
 * {
 * name: string;
 * count: number;
 * }
 */

// Add here your solution
type OmitByType<T, U> = {
    [P in keyof T as T[P] extends U ? never : P]: T[P] 
}

// Add here your example
type OmitNumber = OmitByType<{
  name: string;
  count: number;
  year: number;
  isEnable: boolean;
}, number>;



/**
 * Exercise #2: Implement the utility type `If<C, T, F>`, which evaluates a condition `C`
 * and returns one of two possible types:
 * - `T` if `C` is `true`
 * - `F` if `C` is `false`
 *
 * @description
 * - `C` is expected to be either `true` or `false`.
 * - `T` and `F` can be any type.
 *
 * @example
 * type A = If<true, 'a', 'b'>;  // expected to be 'a'
 * type B = If<false, 'a', 'b'>; // expected to be 'b'
 */

// Add here your solution
type If<C, T, F> = C extends true ? T : F

// Add here your example
type A = If<true, 'Apple', 'Orange'>; 
type B = If<false, 'Apple', 'Orange'>; 



/**
 * Exercise #3: Recreate the built-in `Readonly<T>` utility type without using it.
 *
 * @description
 * Constructs a type that makes all properties of `T` readonly.
 * This means the properties of the resulting type cannot be reassigned.
 *
 * @example
 * interface Todo {
 *   title: string;
 *   description: string;
 * }
 *
 * const todo: MyReadonly<Todo> = {
 *   title: "Hey",
 *   description: "foobar"
 * };
 *
 * todo.title = "Hello";       // Error: cannot reassign a readonly property
 * todo.description = "barFoo"; // Error: cannot reassign a readonly property
 */

// Add here your solution

// Add here your example

type MyReadOnly<T> = {
    readonly [P in keyof T]: T[P]
}

interface Computer {
    processor: string,
    serialNumber: number
}

const computer: MyReadOnly<Computer> = {
    processor: "i5",
    serialNumber: 440
}

//This gives an error
// computer.processor = " hyes"
// computer.serialNumber = true

/**
 * Exercise #4: Recreate the built-in `ReturnType<T>` utility type without using it.
 *
 * @description
 * The `MyReturnType<T>` utility type extracts the return type of a function type `T`.
 *
 * @example
 * const fn = (v: boolean) => {
 *   if (v) {
 *     return 1;
 *   } else {
 *     return 2;
 *   }
 * };
 *
 * type a = MyReturnType<typeof fn>; // expected to be "1 | 2"
 */

// Add here your solution
type MyReturnType<T> = T extends (...args: any[]) => infer U ? U : never

// Add here your example
function myFunction(name: string | number) {
  return name
}

type a = MyReturnType<typeof myFunction>



/**
 * Exercise #5: Extract the type inside a wrapped type like `Promise`.
 *
 * @description
 * Implement a utility type `MyAwaited<T>` that retrieves the type wrapped in a `Promise` or similar structure.
 *
 * If `T` is `Promise<ExampleType>`, the resulting type should be `ExampleType`.
 *
 * @example
 * type ExampleType = Promise<string>;
 *
 * type Result = MyAwaited<ExampleType>; // expected to be "string"
 */

// Add here your solution
type MyAwaited<T> = T extends Promise<infer U> ? U : never
// Add here your example

type ExampleType = Promise<boolean>;
type Result = MyAwaited<ExampleType>;



/**
 * Exercise 6: Create a utility type `RequiredByKeys<T, K>` that makes specific keys of `T` required.
 *
 * @description
 * The type takes two arguments:
 * - `T`: The object type.
 * - `K`: A union of keys in `T` that should be made required.
 *
 * If `K` is not provided, the utility should behave like the built-in `Required<T>` type, making all properties required.
 *
 * @example
 * interface User {
 *   name?: string;
 *   age?: number;
 *   address?: string;
 * }
 *
 * type UserRequiredName = RequiredByKeys<User, 'name'>;
 * expected to be: { name: string; age?: number; address?: string }
 */

// This was my first solution but I realized that I was doing Required<Pick>> manually, so I changed it in the next section
// type MyRequiredByKeys<T, K extends keyof T> = {
//     [P in K]-?: T[P]
// } & Omit<T, K>


//My last solution
type MyRequiredByKeys<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>

// Add here your example
 interface User {
   name?: string;
   age?: number;
   address?: string;
 }
 type UserRequiredName = MyRequiredByKeys<User, 'name' | 'address'>;