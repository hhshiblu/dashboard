import { Header } from "@/components/header";
import { ProductsClient } from "@/components/products/products-client";
import { getProducts } from "@/actions/productActions";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }) {
  const searchParamsObj = await searchParams;
  const result = await getProducts(searchParamsObj);

  if (!result.success) {
    return (
      <div>
        <Header />
        <div className="md:max-w-7xl mx-auto p-4">
          <p className="text-red-500">{result.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="md:max-w-7xl mx-auto">
        <ProductsClient
          products={result.data || []}
          pagination={
            result.pagination || { page: 1, limit: 12, total: 0, totalPages: 1 }
          }
        />
      </div>
    </div>
  );
}
