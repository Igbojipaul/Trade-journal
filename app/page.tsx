import DashboardStats from "@/components/DashboardStats";
import Header from "@/components/Header";
import RecentTrades from "@/components/RecentTrades";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <Header title="Dashboard" subtitle="Overview of your trading performance" showBackButton={false} />
        <DashboardStats />
        <RecentTrades />
      </div>
    </main>
  );
}
