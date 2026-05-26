import { useAdminStats } from "@/hooks/api-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Building2, Map, Compass, Star, Heart, Activity } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  const statCards = [
    { title: "Total Users", value: stats?.total_users, icon: Users, color: "text-blue-500", link: "/admin/users" },
    { title: "Tourists", value: stats?.total_tourists, icon: Activity, color: "text-indigo-500", link: "/admin/users" },
    { title: "Companies", value: stats?.total_companies, icon: Building2, color: "text-purple-500", link: "/admin/companies" },
    { title: "Programs", value: stats?.total_programs, icon: Compass, color: "text-orange-500", link: "/admin/programs" },
    { title: "Countries", value: stats?.total_countries, icon: Map, color: "text-emerald-500", link: "/admin/countries" },
    { title: "Reviews", value: stats?.total_reviews, icon: Star, color: "text-yellow-500", link: null },
    { title: "Favorites", value: stats?.total_favorites, icon: Heart, color: "text-red-500", link: null },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of platform activity and statistics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))
        ) : (
          statCards.map((stat, index) => {
            const CardWrap = stat.link ? Link : 'div';
            return (
              <CardWrap key={index} href={stat.link || undefined} className={stat.link ? "block cursor-pointer hover:-translate-y-1 transition-transform" : ""}>
                <Card className="h-full border shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value?.toLocaleString() || 0}</div>
                  </CardContent>
                </Card>
              </CardWrap>
            );
          })
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link href="/admin/users" className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors">
              <Users className="w-5 h-5 mr-3 text-primary" /> Manage Users
            </Link>
            <Link href="/admin/companies" className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors">
              <Building2 className="w-5 h-5 mr-3 text-primary" /> Manage Companies
            </Link>
            <Link href="/admin/programs" className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors">
              <Compass className="w-5 h-5 mr-3 text-primary" /> Manage Programs
            </Link>
            <Link href="/admin/countries" className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors">
              <Map className="w-5 h-5 mr-3 text-primary" /> Manage Countries
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
