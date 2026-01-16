/**
 *  Challenge 5: Get Departments with Product Count
 *
 * Create a function that takes an array of departments and products, and returns a new array of departments with the amount of products available in each department.
 *
 * Requirements:
 * - The function should accept an array of Department objects and an array of Product objects.
 * - Each department should include the quantity of products available in that department.
 * - The department should be idetified just by its name and id other properties should be excluded.
 * - In the information of the department, include the amount of products available in that department and just the name and id of the department.
 * - Add the name of the products in an array called productsNames inside the department object.
 */

import { Product, Department } from "./1-types";
import { fetchData } from "./utils/fetchData.util";

interface DepartmentAndProductsResult extends Pick<Department, 'id' | 'name'> {
  productsAvailable: number;
  productNames: string[];
}

async function getDepartmentsWithProductCount(
  departments: Department[],
  products: Product[],
): Promise<DepartmentAndProductsResult[]> {

  const departmentWithProducts = new Map<number, string[]>()

  for (const product of products) {
    const productsByDepartment = departmentWithProducts.get(product.departmentId)
    if (productsByDepartment) {
      productsByDepartment.push(product.name)
      departmentWithProducts.set(product.departmentId, productsByDepartment)
    } else {
      departmentWithProducts.set(product.departmentId, [product.name])
    }
  }

  const result: DepartmentAndProductsResult[] = departments.map((department) => {
    const dataForCurrentDepartment = departmentWithProducts.get(department.id) ?? []
    
      return {
        id: department.id,
        name: department.name,
        productsAvailable: dataForCurrentDepartment.length,
        productNames: dataForCurrentDepartment
      }
     
  })

  return result
}

async function runChallenge() {
  const products: Product[] = await fetchData<Product>("products.json");
  const departments: Department[] = await fetchData<Department>("departments.json");
  const result = await getDepartmentsWithProductCount(departments, products);

  console.log(result);
}

runChallenge().catch(console.error);
