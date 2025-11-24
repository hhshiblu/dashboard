import { Header } from "@/components/header";
import { ExpenseClient } from "@/components/expense/expense-client";
import { getExpenses } from "@/actions/expenseActions";

export const dynamic = "force-dynamic";

export default async function ExpensePage({ searchParams }) {
  const searchParamsObj = await searchParams;
  const result = await getExpenses(searchParamsObj);

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
        <ExpenseClient
          expenses={result.data || []}
          pagination={
            result.pagination || { page: 1, limit: 3, total: 0, totalPages: 1 }
          }
        />
      </div>
    </div>
  );
}
