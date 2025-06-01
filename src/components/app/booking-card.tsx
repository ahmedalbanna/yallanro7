import type { Booking, Experience, User } from "@/models";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, MessageSquare, Check, X, Hourglass, CheckCircle, XCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";

interface BookingCardProps {
  booking: Booking;
  experience?: Partial<Experience>; 
  relatedUser?: Partial<User>; 
  currentUserRole: 'client' | 'host' | 'admin';
}

const getStatusVariant = (status: Booking['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'confirmed': return 'default'; 
    case 'pending': return 'secondary'; 
    case 'completed': return 'outline'; 
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
};

const getStatusTextAndIcon = (status: Booking['status']): { text: string; icon: React.ElementType } => {
    switch (status) {
        case 'pending': return { text: 'قيد الانتظار', icon: Hourglass };
        case 'confirmed': return { text: 'مؤكد', icon: CheckCircle };
        case 'completed': return { text: 'مكتمل', icon: CheckCircle }; // Could be a different icon for completed
        case 'cancelled': return { text: 'ملغى', icon: XCircle };
        default: return { text: status, icon: Hourglass };
    }
}

export function BookingCard({ booking, experience, relatedUser, currentUserRole }: BookingCardProps) {
  const experienceTitle = experience?.title || "تجربة محجوزة";
  const experienceImage = experience?.images?.[0] || "https://placehold.co/300x200.png?text=Booking&font=belleza";
  const relatedUserName = relatedUser?.displayName || (currentUserRole === 'client' ? "المضيف" : "العميل");
  const { text: statusText, icon: StatusIcon } = getStatusTextAndIcon(booking.status);

  const bookingDate = typeof booking.bookingDate === 'string' ? parseISO(booking.bookingDate) : booking.bookingDate;


  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden border-primary/10 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Link href={`/experiences/${booking.experienceRef}`} className="block aspect-[16/9] sm:aspect-[2/1] w-full relative overflow-hidden rounded-t-xl">
          <Image
            src={experienceImage}
            alt={experienceTitle}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="booked experience"
          />
        </Link>
         <Badge 
            variant={getStatusVariant(booking.status)} 
            className="absolute top-3 right-3 text-xs px-3 py-1.5 font-body flex items-center gap-1 shadow-md"
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {statusText}
          </Badge>
      </CardHeader>
      <CardContent className="p-4 space-y-2 font-body flex-grow">
        <CardTitle className="text-xl font-headline hover:text-primary transition-colors duration-200 line-clamp-2" title={experienceTitle}>
          <Link href={`/experiences/${booking.experienceRef}`}>{experienceTitle}</Link>
        </CardTitle>
        <div className="text-sm text-muted-foreground space-y-1.5">
          <p className="flex items-center"><CalendarDays className="ml-2 h-4 w-4 text-accent" /> 
            {format(bookingDate, "eeee, d MMMM yyyy", { locale: arSA })} - {booking.bookingTime}
          </p>
          <p className="flex items-center"><Users className="ml-2 h-4 w-4 text-accent" /> {booking.numberOfGuests} ضيوف</p>
          {currentUserRole === 'client' && relatedUser &&
            <p className="text-sm">المضيف: <span className="font-medium text-foreground">{relatedUserName}</span></p>
          }
          {currentUserRole === 'host' && relatedUser &&
            <p className="text-sm">العميل: <span className="font-medium text-foreground">{relatedUserName}</span></p>
          }
        </div>
        <p className="text-lg font-bold text-primary pt-2">
          الإجمالي: {booking.totalPrice} {experience?.currency || 'ر.س'}
        </p>
      </CardContent>
      <CardFooter className="p-4 border-t flex flex-wrap gap-2 justify-between items-center font-body mt-auto">
        <Button variant="outline" size="sm" asChild className="border-border hover:bg-accent/10 hover:border-accent/50">
          <Link href={`/chat/booking-${booking.bookingId}`}> {/* Example chat link */}
            <MessageSquare className="ml-2 h-4 w-4" /> تواصل مع {relatedUserName}
          </Link>
        </Button>
        {currentUserRole === 'host' && booking.status === 'pending' && (
          <div className="flex gap-2">
            <Button size="sm" variant="destructive" className="px-3">
              <X className="ml-1 h-4 w-4" /> رفض
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white px-3">
              <Check className="ml-1 h-4 w-4" /> تأكيد
            </Button>
          </div>
        )}
         {currentUserRole === 'client' && booking.status === 'confirmed' && (new Date(booking.bookingDate) > new Date()) && (
            <Button size="sm" variant="destructive" className="px-3">
              <X className="ml-1 h-4 w-4" /> إلغاء الحجز
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
