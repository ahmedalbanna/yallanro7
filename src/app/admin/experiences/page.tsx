"use client";

import { AppHeader } from "@/components/app/app-header";
import { ExperienceCard } from "@/components/app/experience-card"; // Basic card, actions need to be added
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Edit, Trash2, CheckCircle, XCircle, Eye, MoreVertical } from "lucide-react";
import type { Experience } from "@/models";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


const mockAdminExperiences: Experience[] = [
  { experienceId: 'expA1', title: 'رحلة غوص استكشافية في البحر الأحمر', hostRef: 'hostPro1', isActive: true, price: 450, currency: "ر.س", city: "جدة", categoryRef: "مغامرات بحرية", images: ['https://placehold.co/600x400.png?text=Diving&font=belleza'], description: '', activities:[], duration:'', maxGuests:0, location:{lat:0,lng:0}, address:'', availableDates:[], availableTimes:[], createdAt: new Date(), updatedAt: new Date()},
  { experienceId: 'expA2', title: 'دورة صناعة العطور التقليدية', hostRef: 'hostArtisan2', isActive: false, price: 280, currency: "ر.س", city: "الطائف", categoryRef: "حرف يدوية", images: ['https://placehold.co/600x400.png?text=Perfume&font=belleza'], description: '', activities:[], duration:'', maxGuests:0, location:{lat:0,lng:0}, address:'', availableDates:[], availableTimes:[], createdAt: new Date(), updatedAt: new Date()},
  { experienceId: 'expA3', title: 'جولة تذوق القهوة السعودية المختصة', hostRef: 'hostCafe3', isActive: true, price: 150, currency: "ر.س", city: "الرياض", categoryRef: "مأكولات ومشروبات", images: ['https://placehold.co/600x400.png?text=Coffee&font=belleza'], description: '', activities:[], duration:'', maxGuests:0, location:{lat:0,lng:0}, address:'', availableDates:[], availableTimes:[], createdAt: new Date(), updatedAt: new Date()},
  // Add more mock experiences with varying statuses
];

const mockHostNames: Record<string, string> = {
    hostPro1: "مضيف محترف للسياحة",
    hostArtisan2: "حرفي مبدع",
    hostCafe3: "مقهى الذواقة"
}


// Enhanced ExperienceCard specifically for admin listings
const AdminExperienceCard = ({ experience }: { experience: Experience }) => {
  const { toast } = useToast();

  const handleAction = (action: "تفعيل" | "تعطيل" | "حذف") => {
    // Actual action logic here
    toast({ title: `تم ${action} التجربة`, description: `تم ${action} التجربة "${experience.title}" بنجاح (محاكاة).`});
  }
  const hostName = mockHostNames[experience.hostRef] || "مضيف غير معروف";

  return (
    <div className="relative group">
      <ExperienceCard experience={{...experience, hostRef: hostName}} />
      <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-9 w-9 shadow-md">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">إجراءات التجربة</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="font-body w-48">
                <DropdownMenuItem asChild>
                     <Link href={`/admin/experiences/${experience.experienceId}/view`}> {/* Placeholder for view/edit */}
                        <Eye className="ml-2 h-4 w-4 text-blue-500" /> عرض/تعديل التفاصيل
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {experience.isActive ? (
                    <DropdownMenuItem onSelect={() => handleAction("تعطيل")} className="text-amber-600 focus:bg-amber-500/10 focus:text-amber-700">
                        <XCircle className="ml-2 h-4 w-4" /> تعطيل التجربة
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onSelect={() => handleAction("تفعيل")} className="text-green-600 focus:bg-green-500/10 focus:text-green-700">
                        <CheckCircle className="ml-2 h-4 w-4" /> تفعيل التجربة
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <Trash2 className="ml-2 h-4 w-4" /> حذف التجربة
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent dir="rtl">
                        <AlertDialogHeader>
                        <AlertDialogTitle className="font-headline">هل أنت متأكد من الحذف؟</AlertDialogTitle>
                        <AlertDialogDescription className="font-body">
                            لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف التجربة بشكل دائم.
                            <br/> <span className="font-semibold">"{experience.title}"</span>
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="font-body">
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleAction("حذف")} className="bg-destructive hover:bg-destructive/90">
                            حذف
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Badge 
        variant={experience.isActive ? "default" : "destructive"} 
        className="absolute top-3 right-3 text-xs px-2.5 py-1 font-body shadow-md"
      >
        {experience.isActive ? "نشطة" : "غير نشطة"}
      </Badge>
    </div>
  );
};


export default function ManageExperiencesAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredExperiences = useMemo(() => {
    return mockAdminExperiences.filter(exp => {
      const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            exp.hostRef.toLowerCase().includes(searchTerm.toLowerCase()); // Or search by host name if available
      const matchesStatus = statusFilter === "all" || 
                            (statusFilter === "active" && exp.isActive) ||
                            (statusFilter === "inactive" && !exp.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-headline text-primary">إدارة التجارب (للمسؤول)</h1>
        </div>

        <div className="mb-8 p-4 bg-card rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="relative">
              <Label htmlFor="search-experiences" className="sr-only">بحث عن تجارب</Label>
              <Input
                id="search-experiences"
                type="text"
                placeholder="بحث بالعنوان أو اسم المضيف..."
                className="h-11 pl-10 text-base bg-input focus:bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <Label htmlFor="status-filter" className="sr-only">فلترة حسب الحالة</Label>
              <Select dir="rtl" onValueChange={(value) => setStatusFilter(value as "all" | "active" | "inactive")} defaultValue="all">
                <SelectTrigger id="status-filter" className="h-11 text-base bg-input focus:bg-background">
                  <Filter className="ml-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="فلترة حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-body">جميع الحالات</SelectItem>
                  <SelectItem value="active" className="font-body">نشطة</SelectItem>
                  <SelectItem value="inactive" className="font-body">غير نشطة</SelectItem>
                  {/* Could add 'Pending Review' if that state exists */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {filteredExperiences.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
            {filteredExperiences.map(exp => (
              <AdminExperienceCard key={exp.experienceId} experience={exp} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-10 text-lg font-body">
            لا توجد تجارب تطابق معايير البحث أو الفلترة.
          </p>
        )}
         {filteredExperiences.length > 12 && ( /* Basic pagination placeholder */
            <div className="mt-10 flex justify-center">
                <Button variant="outline">تحميل المزيد</Button>
            </div>
        )}
      </main>
      <footer className="py-8 border-t bg-card mt-12">
        <div className="container text-center text-sm text-muted-foreground font-body">
          © {new Date().getFullYear()} YallaNro7. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
