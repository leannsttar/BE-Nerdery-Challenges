/**
 *  Challenge 4: Get Countries with Brands and Amount of Products
 *
 * Create a function that takes an array of brands and products, and returns the countries with the amount of products available in each country.
 *
 * Requirements:
 * - The function should accept an array of Brand objects and an array of Product objects.
 * - Each brand should have a country property.
 * - Each product should have a brandId property that corresponds to the id of a brand.
 * - The function should return an array of objects, each containing a country and the amount of products available in that country.
 * - The amount of products should be calculated by counting the number of products that have a brandId matching the id of a brand in the same country.
 * - The return should be a type that allow us to define the country name as a key and the amount of products as a value.
 */

import { Product, Brand } from "./1-types";
import { fetchData } from "./utils/fetchData.util";

type CountryProductsResult = {
  country: string;
  productsAvailable: number;
};

async function getCountriesWithBrandsAndProductCount(
  brands: Brand[],
  products: Product[],
): Promise<CountryProductsResult[]> {
  const brandsWithCountry = new Map<string | number, string>();
  const countryWithProducts = new Map<string, number>();

  for (const brand of brands) {
    const partsOfLocation = brand.headquarters.split(",");
    const country = partsOfLocation[1].trim();
    if (country) {
      brandsWithCountry.set(brand.id, country);

      if (!countryWithProducts.has(country)) {
        countryWithProducts.set(country, 0);
      }
    }
  }

  for (const product of products) {
    const country = brandsWithCountry.get(product.brandId);
    if (country) {
      countryWithProducts.set(
        country,
        (countryWithProducts.get(country) || 0) + 1,
      );
    }
  }

  return [...countryWithProducts].map(([country, productsAvailable]) => (
    {
      country,
      productsAvailable
    }
  ));
}

async function runChallenge() {
  const products: Product[] = await fetchData<Product>("products.json");
  const brands: Brand[] = await fetchData<Brand>("brands.json");
  const result = await getCountriesWithBrandsAndProductCount(brands, products);

  console.log(result);
}

runChallenge().catch(console.error);
