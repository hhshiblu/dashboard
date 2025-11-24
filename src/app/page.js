import { Header } from "@/components/header";
import { HomeClient } from "@/components/home/home-client";
import { getHomeStats } from "@/actions/homeActions";
export const dynamic = "force-dynamic";
export default async function Home() {
  const statsResult = await getHomeStats();

  if (!statsResult.success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-4">
          <p className="text-red-500">{statsResult.message}</p>
        </div>
      </div>
    );
  }

  const stats = statsResult.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HomeClient stats={stats} />
    </div>
  );
}
