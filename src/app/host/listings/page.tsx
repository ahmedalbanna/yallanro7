"use client";

import { AppHeader } from "@/components/app/app-header";
import { ExperienceCard } from "@/components/app/experience-card"; // Assuming ExperienceCard can handle edit/delete actions
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import type { Experience } from "@/models";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const mockHostExperiences: Experience[] = [
  { experienceId: 'hostExp1', title: 'تجربتي الأولى: جولة في مزارع التمر', description: 'وصف تجربتي الأولى...', activities: [], images: ['https://placehold.co/600x400.png?text=My+Exp+1&font=belleza'], price: 120, currency: 'ر.س', duration: '3 ساعات', maxGuests: 8, location: {lat:0,lng:0}, address: "مزرعة النخيل، الدرعية", city: "الرياض", categoryRef: "زراعة", hostRef: "host123", availableDates: [], availableTimes: [], isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { experienceId: 'hostExp2', title: 'ورشة صناعة الفخار التقليدي', description: 'وصف تجربتي الثانية...', activities: [], images: ['https://placehold.co/600x400.png?text=My+Exp+2&font=belleza'], price: 250, currency: 'ر.س', duration: '4 ساعات', maxGuests: 5, location: {lat:0,lng:0}, address: "حي الفنون، جدة", city: "جدة", categoryRef: "حرف يدوية", hostRef: "host123", availableDates: [], availableTimes: [], isActive: false, createdAt: new Date(), updatedAt: new Date() },
   { experienceId: 'hostExp3', title: 'مغامرة تسلق الجبال للمبتدئين', description: 'وصف تجربتي الثالثة...', activities: [], images: ['https://placehold.co/600x400.png?text=My+Exp+3&font=belleza'], price: 400, currency: 'ر.س', duration: 'يوم كامل', maxGuests: 6, location: {lat:0,lng:0}, address: "جبال طويق", city: "الرياض", categoryRef: "مغامرات", hostRef: "host123", availableDates: [], availableTimes: [], isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

// Enhanced ExperienceCard specifically for host listings with edit/delete
const HostExperienceCard = ({ experience }: { experience: Experience }) => {
  const { toast } = useToast();
  const handleDelete = () => {
    // Actual delete logic here
    toast({ title: "تم الحذف", description: `تم حذف التجربة "${experience.title}".`});
  }
  return (
    <div className="relative group">
      <ExperienceCard experience={experience} />
      <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <Button asChild size="icon" variant="secondary" className="h-9 w-9 shadow-md">
          <Link href={`/host/experiences/${experience.experienceId}/edit`} aria-label={`تعديل ${experience.title}`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="icon" variant="destructive" className="h-9 w-9 shadow-md">
              <Trash2 className="h-4 w-4" />
            </Button>
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
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {!experience.isActive && (
        <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
          <span className="text-white text-lg font-semibold bg-black/50 px-3 py-1 rounded font-body">غير نشطة</span>
        </div>
      )}
    </div>
  );
};


export default function MyListingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-4xl font-headline text-primary">تجاربي المنشورة</h1>
          <Button asChild size="lg">
            <Link href="/host/experiences/new">
              <PlusCircle className="ml-2 h-5 w-5" />
              إضافة تجربة جديدة
            </Link>
          </Button>
        </div>

        {mockHostExperiences.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {mockHostExperiences.map(exp => (
              <HostExperienceCard key={exp.experienceId} experience={exp} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-headline text-muted-foreground mb-4">لم تقم بإضافة أي تجارب بعد.</h2>
            <p className="text-lg font-body text-muted-foreground mb-6">ابدأ الآن وشارك شغفك مع العالم!</p>
            <Button asChild size="lg">
              <Link href="/host/experiences/new">
                <PlusCircle className="ml-2 h-5 w-5" />
                إنشاء أول تجربة لك
              </Link>
            </Button>
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
