import { AppHeader } from "@/components/app/app-header";
import { PlaceholderContent } from "@/components/app/placeholder-content";
import { StatsCard } from "@/components/app/stats-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DollarSign, ListChecks, Hourglass, PlusCircle } from "lucide-react";

export default function HostDashboardPage() {
  // Mock data for stats cards
  const stats = {
    totalBookings: 125,
    pendingBookings: 5,
    totalEarnings: "15,750 ر.س",
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-headline text-primary">لوحة تحكم المضيف</h1>
          <Button asChild>
            <Link href="/host/experiences/new">
              <PlusCircle className="ml-2 h-5 w-5" />
              إضافة تجربة جديدة
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatsCard 
            title="إجمالي الحجوزات" 
            value={stats.totalBookings} 
            icon={ListChecks}
            description="جميع الحجوزات المؤكدة والمكتملة"
            colorClass="text-blue-500"
          />
          <StatsCard 
            title="الحجوزات المعلقة" 
            value={stats.pendingBookings} 
            icon={Hourglass}
            description="حجوزات تحتاج إلى تأكيدك"
            colorClass="text-amber-500"
          />
          <StatsCard 
            title="إجمالي الأرباح" 
            value={stats.totalEarnings} 
            icon={DollarSign}
            description="الأرباح من جميع الحجوزات المكتملة"
            colorClass="text-green-500"
          />
        </div>
        
        <PlaceholderContent 
          title="نظرة عامة على الحجوزات والتجارب" 
          message="سيتم هنا عرض أحدث الحجوزات وتجاربك النشطة مع إجراءات سريعة."
        />
        
        {/* Quick links (optional, could be part of placeholder or actual content later) */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/host/listings" className="block p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow border-primary/10 hover:border-primary/30">
                <h2 className="text-2xl font-headline text-accent mb-2">إدارة تجاربي</h2>
                <p className="text-muted-foreground font-body">عرض وتعديل وحذف التجارب التي قمت بإنشائها.</p>
            </Link>
            <Link href="/host/bookings" className="block p-6 bg-card rounded-xl shadow-lg hover:shadow-xl transition-shadow border-primary/10 hover:border-primary/30">
                <h2 className="text-2xl font-headline text-accent mb-2">إدارة الحجوزات</h2>
                <p className="text-muted-foreground font-body">مراجعة وتأكيد أو رفض الحجوزات الواردة من العملاء.</p>
            </Link>
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
