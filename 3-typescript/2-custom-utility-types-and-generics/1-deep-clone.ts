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

function deepClone<T>(objectToClone: T): any {


    
}

const object = {
  id: 123,
  nombre: "Ana Pérez",
  activo: true,
  edad: null,
  apodo: undefined,

  direccion: {
    calle: "Av. Central",
    numero: 45,
    ciudad: "Madrid",
    coordenadas: {
      lat: 40.4168,
      lng: -3.7038,
    },
  },

  hobbies: [
    "leer",
    "correr",
    {
      nombre: "programar",
      nivel: "avanzado",
      horasPorSemana: 10,
    },
  ],

  historialCompras: [
    {
      producto: "Laptop",
      precio: 1200.99,
      entregado: true,
    },
    {
      producto: "Mouse",
      precio: 25.5,
      entregado: false,
    },
  ],
};

console.log(deepClone(object));
