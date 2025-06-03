
import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, Tag, MapPin, Star, MessageSquare, CalendarDays, CheckCircle, Radio, Award, Sparkles } from "lucide-react";
import type { Experience, User } from "@/models";
import { InteractiveMap } from "@/components/app/interactive-map";

// Mock data - replace with actual data fetching
const mockExperience: Experience = {
  experienceId: 'exp1',
  title: 'رحلة سفاري صحراوية مثيرة مع عشاء تقليدي فاخر',
  description: 'انطلق في مغامرة لا تُنسى عبر كثبان الذهب الرملية الساحرة، واستمتع بتجربة قيادة سيارات الدفع الرباعي المثيرة بين التضاريس المتنوعة. شاهد غروب الشمس الخلاب وهو يلون السماء بألوان دافئة، واختتم يومك بعشاء تقليدي فاخر تحت النجوم المتلألئة. تتضمن التجربة ركوب الجمال، الرسم بالحناء التقليدي، وعروض ترفيهية حية تأسر الألباب.',
  activities: ['قيادة سيارات الدفع الرباعي في الكثبان', 'ركوب الجمال في الصحراء', 'مشاهدة غروب الشمس الساحر', 'عشاء تقليدي فاخر (بوفيه)', 'جلسة تصوير فوتوغرافي احترافية', 'الرسم بالحناء للسيدات', 'عرض رقص شرقي وعروض فلكلورية'],
  images: [
    'https://placehold.co/1200x800.png?text=Safari+Dunes&font=belleza',
    'https://placehold.co/1200x800.png?text=Camel+Ride&font=belleza',
    'https://placehold.co/1200x800.png?text=Desert+Sunset&font=belleza',
    'https://placehold.co/1200x800.png?text=Traditional+Dinner&font=belleza',
    'https://placehold.co/1200x800.png?text=Henna+Art&font=belleza',
  ],
  price: 350,
  currency: 'ر.س',
  duration: '6 ساعات',
  maxGuests: 10,
  location: { lat: 24.774265, lng: 46.738586 }, 
  address: 'مخيم صحراوي فاخر، بالقرب من الرياض',
  city: 'الرياض',
  categoryRef: 'مغامرات', // Should be category name or ID to fetch name
  hostRef: 'host1',
  availableDates: ['2024-08-15', '2024-08-16', '2024-08-22', '2024-08-23'],
  availableTimes: ['03:00 PM', '04:00 PM'],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockHost: User = {
  uid: 'host1',
  displayName: 'أحمد المستكشف',
  email: 'ahmed.explorer@example.com',
  photoUrl: 'https://placehold.co/100x100.png?text=Host&font=belleza',
  role: 'host',
  bio: 'مضيف شغوف بتقديم تجارب فريدة لاستكشاف جمال الصحراء وثقافتها الغنية. أهدف إلى منح ضيوفي ذكريات لا تُنسى وتجارب تفوق توقعاتهم. لدي خبرة واسعة في تنظيم الرحلات الصحراوية الآمنة والممتعة.',
};

const mockReviews = [
  { id: 'rev1', userName: 'سارة عبدالله', rating: 5, comment: 'تجربة رائعة جداً! المضيف كان ودوداً والمناظر خلابة. العشاء كان لذيذاً والأنشطة ممتعة. أنصح بها بشدة!', avatar: 'https://placehold.co/40x40.png?text=S&font=belleza' },
  { id: 'rev2', userName: 'محمد خالد', rating: 4, comment: 'استمتعت كثيراً بالرحلة، خاصة قيادة السيارات. كان الجو رائعاً والمخيم مريح. أتمنى لو كان وقت ركوب الجمال أطول قليلاً.', avatar: 'https://placehold.co/40x40.png?text=M&font=belleza' },
  { id: 'rev3', userName: 'فاطمة علي', rating: 5, comment: 'كل شيء كان مثالياً! من التنظيم إلى الأنشطة والضيافة. شكراً لأحمد على هذه التجربة المميزة.', avatar: 'https://placehold.co/40x40.png?text=F&font=belleza' },
];

interface ExperienceDetailsPageProps {
  params: { experienceId: string };
}

export default function ExperienceDetailsPage({ params }: ExperienceDetailsPageProps) {
  const { experienceId } = params;
  const experience = mockExperience; // In real app, fetch by experienceId
  const host = mockHost; // In real app, fetch by experience.hostRef
  const averageRating = mockReviews.length > 0 ? mockReviews.reduce((acc, r) => acc + r.rating, 0) / mockReviews.length : 0;


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-xl rounded-xl overflow-hidden border-primary/10">
               <ScrollArea className="w-full whitespace-nowrap rounded-t-md">
                <div className="flex aspect-[16/9] sm:aspect-[2/1] w-full">
                  {experience.images.map((img, index) => (
                    <div key={index} className="shrink-0 w-full h-full relative">
                       <Image
                        src={img}
                        alt={`${experience.title} - صورة ${index + 1}`}
                        fill
                        className="object-cover"
                        data-ai-hint="adventure landscape"
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                      />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
               <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                    <CardTitle className="text-3xl md:text-4xl font-headline text-primary leading-tight">{experience.title}</CardTitle>
                    <div className="flex items-center gap-1 text-amber-500 mt-2 sm:mt-0 shrink-0">
                        {[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < Math.round(averageRating) ? 'fill-current' : ''}`} />)}
                        <span className="text-sm text-muted-foreground font-body ml-1">({averageRating.toFixed(1)} / {mockReviews.length} مراجعات)</span>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground font-body mt-2 text-sm">
                  <span className="flex items-center"><MapPin className="ml-1 h-4 w-4 text-primary/80" /> {experience.city} - {experience.address}</span>
                  <span className="flex items-center"><Tag className="ml-1 h-4 w-4 text-primary/80" /> {experience.categoryRef}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl rounded-xl border-primary/10">
              <CardHeader><CardTitle className="text-2xl font-headline">ماذا ستفعل؟</CardTitle></CardHeader>
              <CardContent className="space-y-6 font-body">
                <p className="text-lg leading-relaxed text-foreground/90">{experience.description}</p>
                <div>
                  <h3 className="text-xl font-headline font-semibold mb-3 text-foreground">الأنشطة المتضمنة:</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {experience.activities.map(activity => (
                      <li key={activity} className="flex items-center">
                        <Sparkles className="ml-2 h-4 w-4 text-accent shrink-0" />
                        <span className="text-foreground/80">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm pt-4 border-t">
                    <div className="flex items-center p-3 bg-muted/30 rounded-lg">
                        <Clock className="ml-2 h-5 w-5 text-primary" />
                        <div><span className="block font-semibold">المدة</span><span>{experience.duration}</span></div>
                    </div>
                    <div className="flex items-center p-3 bg-muted/30 rounded-lg">
                        <Users className="ml-2 h-5 w-5 text-primary" />
                        <div><span className="block font-semibold">الضيوف</span><span>حتى {experience.maxGuests}</span></div>
                    </div>
                     <div className="flex items-center p-3 bg-muted/30 rounded-lg">
                        <Award className="ml-2 h-5 w-5 text-primary" />
                        <div><span className="block font-semibold">المستوى</span><span>مناسب للجميع</span></div>
                    </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl rounded-xl border-primary/10">
              <CardHeader><CardTitle className="text-2xl font-headline">عن المضيف: {host.displayName}</CardTitle></CardHeader>
              <CardContent className="flex flex-col sm:flex-row items-start gap-6 font-body">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 border-2 border-primary/30">
                  <AvatarImage src={host.photoUrl} alt={host.displayName} />
                  <AvatarFallback className="text-3xl font-headline">{host.displayName.slice(0,2)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <p className="text-foreground/80 leading-relaxed mb-4">{host.bio}</p>
                  <Button asChild variant="outline" size="sm" className="font-body border-border hover:bg-accent/10 hover:border-accent/50">
                    <Link href={`/chat/host-${host.uid}-exp-${experience.experienceId}`}>
                      <MessageSquare className="ml-2 h-4 w-4" /> تواصل مع {host.displayName}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-xl rounded-xl border-primary/10">
              <CardHeader><CardTitle className="text-2xl font-headline">موقع التجربة</CardTitle></CardHeader>
              <CardContent>
                <InteractiveMap lat={experience.location.lat} lng={experience.location.lng} markerLabel={experience.title} />
                <p className="mt-3 text-sm text-muted-foreground font-body">{experience.address}</p>
              </CardContent>
            </Card>

            <Card className="shadow-xl rounded-xl border-primary/10">
              <CardHeader><CardTitle className="text-2xl font-headline">التقييمات والمراجعات ({mockReviews.length})</CardTitle></CardHeader>
              <CardContent className="space-y-6 font-body">
                {mockReviews.map(review => (
                  <div key={review.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/20">
                    <Avatar className="h-11 w-11 shrink-0">
                      <AvatarImage src={review.avatar} alt={review.userName} />
                      <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-base">{review.userName}</h4>
                         <div className="flex">
                            {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`} />)}
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                ))}
                {mockReviews.length > 3 && <Button variant="outline" className="w-full font-body mt-4">عرض جميع المراجعات</Button>}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 relative">
            <Card className="shadow-2xl rounded-xl sticky top-24 border-2 border-primary/50 bg-card">
              <CardHeader className="text-center bg-primary/5 p-5">
                <CardTitle className="text-2xl font-headline">
                  <span className="text-4xl text-primary">{experience.price} {experience.currency}</span>
                  <span className="text-base text-muted-foreground font-body"> / للشخص</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 font-body">
                 <div className="space-y-2 text-sm">
                    <div className="flex items-center text-green-700 dark:text-green-400">
                        <CheckCircle className="ml-2 h-5 w-5"/>
                        <span>تأكيد فوري للحجز</span>
                    </div>
                     <div className="flex items-center text-green-700 dark:text-green-400">
                        <Radio className="ml-2 h-5 w-5"/>
                        <span>متاح في: {experience.availableDates.slice(0,1).join('')}...</span>
                    </div>
                </div>
                 <Button asChild size="lg" className="w-full text-lg py-3 h-14 font-body">
                  <Link href={`/book/${experience.experienceId}`}>احجز الآن</Link>
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  لا تقلق، لن يتم محاسبتك الآن.
                </p>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground text-center font-body p-4 border-t">
                سياسة إلغاء مرنة. تفاصيل عند الدفع.
              </CardFooter>
            </Card>
          </div>
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

