import { fetchData } from "./utils/fetch-data";
import { Product, Brand } from "./1-types";

/**
 * Products - Challenge 1: Product Price Analysis
 *
 * Create a function that analyzes pricing information from an array of products.
 *
 * Requirements:
 * - Create a function called `analyzeProductPrices` that accepts an array of Product objects
 * - The function should return an object containing:
 *   - totalPrice: The sum of all product prices
 *   - averagePrice: The average price of all products (rounded to 2 decimal places)
 *   - mostExpensiveProduct: The complete Product object with the highest price
 *   - cheapestProduct: The complete Product object with the lowest price
 *   - onSaleCount: The number of products that are currently on sale
 *   - averageDiscount: The average discount percentage for products on sale (rounded to 2 decimal places)
 * - Prices should be manage in regular prices and not in sale prices
 * - Use proper TypeScript typing for parameters and return values
 * - Implement the function using efficient array methods
 *
 *
 **/

interface ProductAnalysis {
  totalPrice: number;
  averagePrice: number;
  mostExpensiveProduct: Product;
  cheapestProduct: Product;
  onSaleCount: number;
  averageDiscount: number;
}

function analyzeProductPrices(products: Product[]): ProductAnalysis {
  if (products.length === 0) {
    throw new Error("Cannot analyze product prices: no products provided");
  }

  const data = products.reduce(
    (acc, product) => {
      acc.totalPrice += product.price;

      if (product.price > acc.mostExpensiveProduct.price) {
        acc.mostExpensiveProduct = product;
      }

      if (product.price < acc.cheapestProduct.price) {
        acc.cheapestProduct = product;
      }

      if (product.onSale) {
        acc.onSaleCount++;
      }

      if (product.salePrice && product.salePrice < product.price) {
        const discount =
          ((product.price - product.salePrice) / product.price) * 100;

        acc.totalDiscount += discount;
        acc.productsWithDiscountPrice++;
      }

      return acc;
    },
    {
      totalPrice: 0,
      mostExpensiveProduct: products[0],
      cheapestProduct: products[0],
      onSaleCount: 0,
      totalDiscount: 0,
      productsWithDiscountPrice: 0,
    },
  );

  const averageDiscount =
    data.productsWithDiscountPrice > 0
      ? Number((data.totalDiscount / data.productsWithDiscountPrice).toFixed(2))
      : 0;

  return {
    totalPrice: data.totalPrice,
    averagePrice: Number((data.totalPrice / products.length).toFixed(2)),
    mostExpensiveProduct: data.mostExpensiveProduct,
    cheapestProduct: data.cheapestProduct,
    onSaleCount: data.onSaleCount,
    averageDiscount,
  };
}

async function runChallenge1() {
  const products: Product[] = await fetchData<Product>("products.json");
  const result: ProductAnalysis = await analyzeProductPrices(products);

  console.log("Analysis Result:");
  console.dir(
    {
      ...result,
      averageDiscount: `${result.averageDiscount}%`,
    },
    { depth: null },
  );
}
//RUN THIS IF U WANNA CHECK THE RESULT
runChallenge1().catch(console.error);

/**
 *  Challenge 2: Build a Product Catalog with Brand Metadata
 *
 * Create a function that takes arrays of Product and Brand, and returns a new array of enriched product entries. Each entry should include brand details embedded into the product, under a new brandInfo property (excluding the id and isActive fields).
 *  e.g
 *  buildProductCatalog(products: Product[], brands: Brand[]): EnrichedProduct[]

  Requirements:
  - it should return an array of enriched product entries with brand details
  - Only include products where isActive is true and their corresponding brand is also active.
  - If a product’s brandId does not match any active brand, it should be excluded.
  - The brandInfo field should include the rest of the brand metadata (name, logo, description, etc.).
 */

type BrandInfo = Omit<Brand, "id" | "isActive">;

interface EnrichedProduct extends Product {
  brandInfo: BrandInfo;
}

function buildProductCatalog(
  products: Product[],
  brands: Brand[],
): EnrichedProduct[] {
  const activeBrands = new Map<string, Brand>();

  for (const brand of brands) {
    if (brand.isActive) {
      activeBrands.set(String(brand.id), brand);
    }
  }

  const enriched: EnrichedProduct[] = [];

  for (const product of products) {
    const brand = activeBrands.get(String(product.brandId));
    if (brand && product.isActive) {
      const { id, isActive, ...remainingData } = brand;
      enriched.push({ ...product, brandInfo: remainingData });
    }
  }

  return enriched;
}

async function runChallenge2() {
  const products: Product[] = await fetchData<Product>("products.json");
  const brands: Brand[] = await fetchData<Brand>("brands.json");
  const result: EnrichedProduct[] = await buildProductCatalog(products, brands);

  console.dir(result, { depth: null });
}

//runChallenge2().catch(console.error);

/**
 * Challenge 3: One image per product
 *
 * Create a function that takes an array of products and returns a new array of products, each with only one image.
 *
 * Requirements:
 * - The function should accept an array of Product objects.
 * - Each product should have only one image in the images array.
 * - The image should be the first one in the images array.
 * - If a product has no images, it should be excluded from the result.
 * - The function should return an array of Product objects with the modified images array.
 * - Use proper TypeScript typing for parameters and return values.
 */

function filterProductsWithOneImage(products: Product[]): Product[] {
  // Implement the function logic here

  const result: Product[] = [];

  for (const product of products) {
    if (product.images && product.images.length >= 1) {
      const productCopy = { ...product, images: [product.images[0]] };
      result.push(productCopy);
    }
  }

  return result;
}

async function runChallenge3() {
  const products: Product[] = await fetchData<Product>("products.json");
  const result: Product[] = await filterProductsWithOneImage(products);

  console.dir(result, { depth: null });
}

//runChallenge3().catch(console.error);
