
import { AppHeader } from "@/components/app/app-header";
import { PlaceholderContent } from "@/components/app/placeholder-content";
import { StatsCard } from "@/components/app/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Users, Layers, BookOpen, DollarSign, Settings, BarChart3, MapPin, TagIcon } from "lucide-react"; // Corrected Map to MapPin and Tag to TagIcon

export default function AdminDashboardPage() {
  // Mock data for stats cards
  const stats = {
    totalUsers: 1250,
    totalExperiences: 350,
    totalBookings: 2800,
    totalRevenue: "450,000 ر.س",
  };

  const navigationCards = [
    { title: "إدارة المستخدمين", href: "/admin/users", icon: Users, description: "عرض، تعديل، وحذف المستخدمين." },
    { title: "إدارة التجارب", href: "/admin/experiences", icon: Layers, description: "مراجعة، تفعيل، وتعطيل التجارب." },
    { title: "إدارة الفئات والمدن", href: "/admin/categories-cities", icon: TagIcon, description: "إضافة وتعديل الفئات والمدن المتاحة." },
    { title: "التقارير والإحصائيات", href: "/admin/reports", icon: BarChart3, description: "عرض تقارير مفصلة عن أداء المنصة." },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader /> {/* Assuming AppHeader adapts or has admin-specific variant */}
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-headline text-primary">لوحة تحكم المسؤول</h1>
          <p className="text-lg text-muted-foreground font-body mt-2">نظرة عامة على أداء المنصة وإدارة شاملة.</p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard 
            title="إجمالي المستخدمين" 
            value={stats.totalUsers.toLocaleString('ar-SA')} 
            icon={Users}
            colorClass="text-blue-500"
          />
          <StatsCard 
            title="إجمالي التجارب" 
            value={stats.totalExperiences.toLocaleString('ar-SA')} 
            icon={Layers}
            colorClass="text-purple-500"
          />
          <StatsCard 
            title="إجمالي الحجوزات" 
            value={stats.totalBookings.toLocaleString('ar-SA')} 
            icon={BookOpen}
            colorClass="text-orange-500"
          />
          <StatsCard 
            title="إجمالي الإيرادات" 
            value={stats.totalRevenue} 
            icon={DollarSign}
            colorClass="text-green-500"
          />
        </div>
        
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationCards.map(navItem => (
            <Link href={navItem.href} key={navItem.title} className="block group">
              <Card className="h-full shadow-lg rounded-xl hover:shadow-2xl transition-all duration-300 ease-in-out border-primary/10 hover:border-primary/40 transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-4 pb-3">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                     <navItem.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-headline text-foreground group-hover:text-primary transition-colors">{navItem.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-body text-sm">{navItem.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
           <Link href="/admin/settings" className="block group md:col-span-2 lg:col-span-1">
             <Card className="h-full shadow-lg rounded-xl hover:shadow-2xl transition-all duration-300 ease-in-out border-primary/10 hover:border-primary/40 transform hover:-translate-y-1 bg-muted/30">
                <CardHeader className="flex flex-row items-center gap-4 pb-3">
                   <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                     <Settings className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-2xl font-headline text-foreground group-hover:text-accent transition-colors">إعدادات المنصة</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-body text-sm">تكوين الإعدادات العامة للمنصة.</p>
                </CardContent>
              </Card>
            </Link>
        </div>
        
         <div className="mt-12">
            <PlaceholderContent 
            title="رسوم بيانية ومؤشرات الأداء"
            message="سيتم عرض رسوم بيانية تفاعلية لمتابعة نمو المنصة واتخاذ قرارات مستنيرة."
            icon={BarChart3}
            />
        </div>


      </main>
      <footer className="py-8 border-t bg-card mt-12">
        <div className="container text-center text-sm text-muted-foreground font-body">
          © {new Date().getFullYear()} YallaNro7. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
