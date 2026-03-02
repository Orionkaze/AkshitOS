import { Card } from "@/components/ui";
import { 
  BarChart3, 
  Timer, 
  Code2, 
  Wallet, 
  BookOpen, 
  ArrowUpRight, 
  ArrowDownRight,
  Brain
} from "lucide-react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import MoodChart from "@/components/devmood/MoodChart";

async function getDashboardData(userId: string) {
  const [devMoodCount, focusSessions, snippetsCount, financeSum, studySum, devMoodEntries] = await Promise.all([
    prisma.devMoodEntry.count({ where: { userId } }),
    prisma.focusSession.findMany({ where: { userId }, orderBy: { timestamp: "desc" }, take: 5 }),
    prisma.snippet.count({ where: { userId } }),
    prisma.financeEntry.aggregate({ where: { userId }, _sum: { amount: true } }),
    prisma.studyLog.aggregate({ where: { userId }, _sum: { hours: true } }),
    prisma.devMoodEntry.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 7 }),
  ]);

  return {
    devMoodCount,
    focusSessions,
    snippetsCount,
    financeTotal: financeSum._sum.amount || 0,
    studyTotal: studySum._sum.hours || 0,
    devMoodEntries,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const data = await getDashboardData((session?.user as any)?.id);

  const stats = [
    { 
      label: "DevMood Logs", 
      value: data.devMoodCount, 
      icon: BarChart3, 
      color: "text-accent-primary", 
      bg: "bg-accent-primary/10",
      trend: "Daily Tracking",
      trendUp: true
    },
    { 
      label: "Focus Streak", 
      value: "0 Days", // TODO: Implement streak logic
      icon: Timer, 
      color: "text-accent-secondary", 
      bg: "bg-accent-secondary/10",
      trend: "Keep it up!",
      trendUp: true
    },
    { 
      label: "Code Snippets", 
      value: data.snippetsCount, 
      icon: Code2, 
      color: "text-purple-400", 
      bg: "bg-purple-400/10",
      trend: "Stored safely",
      trendUp: true
    },
    { 
      label: "Total Expenses", 
      value: `$${data.financeTotal.toFixed(2)}`, 
      icon: Wallet, 
      color: "text-red-400", 
      bg: "bg-red-400/10",
      trend: "Recent spend",
      trendUp: false
    },
    { 
      label: "Study Hours", 
      value: data.studyTotal, 
      icon: BookOpen, 
      color: "text-green-400", 
      bg: "bg-green-400/10",
      trend: "Total learning",
      trendUp: true
    },
    { 
      label: "AI Tools", 
      value: "2 Active", 
      icon: Brain, 
      color: "text-accent-primary", 
      bg: "bg-accent-primary/5",
      trend: "Ready to use",
      trendUp: true
    },
  ];

  return (
    <div className="space-y-8 lg:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary lg:text-4xl">
          Welcome back, <span className="text-accent-primary">{session?.user?.name?.split(' ')[0]}</span>.
        </h1>
        <p className="text-text-secondary">Here's a snapshot of your productivity today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="group hover:border-accent-primary/30 transition-all duration-300">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                {stat.trend && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${stat.trendUp ? "text-green-400" : "text-text-secondary"}`}>
                    {stat.trend}
                    {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-bold text-text-primary mt-1">{stat.value}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-text-primary">DevMood Overview</h3>
            <Link href="/devmood" className="text-xs font-bold text-accent-primary uppercase tracking-widest hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <MoodChart data={data.devMoodEntries} />
        </div>

        <Card className="space-y-6">
          <h3 className="text-lg font-bold text-text-primary">Recent Focus Sessions</h3>
          <div className="space-y-4">
            {data.focusSessions.length > 0 ? (
                data.focusSessions.map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-bg-primary/50 border border-text-secondary/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent-secondary/10 text-accent-secondary">
                        <Timer size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary capitalize">{Math.round(session.duration / 60)}m Session</p>
                        <p className="text-xs text-text-secondary">{new Date(session.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
                <div className="py-12 text-center space-y-2">
                  <p className="text-text-secondary text-sm">You haven't had any focus sessions yet.</p>
                  <button className="text-accent-primary text-sm font-medium hover:underline">Start your first session</button>
                </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
