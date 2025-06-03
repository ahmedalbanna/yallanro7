
"use client";

import type { Booking, Experience, User } from "@/models";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarDays, Users, MessageSquare, Check, X, Hourglass, CheckCircle, XCircle, Star } from "lucide-react";
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
        case 'completed': return { text: 'مكتمل', icon: CheckCircle };
        case 'cancelled': return { text: 'ملغى', icon: XCircle };
        default: return { text: status, icon: Hourglass };
    }
}

export function BookingCard({ booking, experience, relatedUser, currentUserRole }: BookingCardProps) {
  const { toast } = useToast();
  const experienceTitle = experience?.title || "تجربة محجوزة";
  const experienceImage = experience?.images?.[0] || "https://placehold.co/300x200.png?text=Booking&font=belleza";
  const relatedUserName = relatedUser?.displayName || (currentUserRole === 'client' ? "المضيف" : "العميل");
  const { text: statusText, icon: StatusIcon } = getStatusTextAndIcon(booking.status);

  const bookingDate = typeof booking.bookingDate === 'string' ? parseISO(booking.bookingDate) : booking.bookingDate;

  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [hasBeenReviewed, setHasBeenReviewed] = useState(false); // Simulate if review was submitted

  const handleStarClick = (rating: number) => {
    setCurrentRating(rating);
  };

  const handleReviewSubmit = () => {
    if (currentRating === 0) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار تقييم (عدد النجوم).",
        variant: "destructive",
      });
      return;
    }
    console.log("Review Submitted:", {
      bookingId: booking.bookingId,
      experienceId: booking.experienceRef,
      rating: currentRating,
      comment: reviewComment,
    });
    toast({
      title: "تم إرسال التقييم!",
      description: "شكراً لك على تقييم التجربة.",
    });
    setHasBeenReviewed(true);
    setIsReviewDialogOpen(false);
    // Reset for next time, or fetch actual review status
    // setCurrentRating(0); 
    // setReviewComment("");
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden border-primary/10 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Link href={`/experiences/${booking.experienceRef}`} className="block aspect-[16/9] sm:aspect-[2/1] w-full relative overflow-hidden rounded-t-xl">
          <Image
            src={experienceImage}
            alt={experienceTitle}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="booked experience event"
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
          <Link href={`/${currentUserRole === 'host' ? 'host/' : ''}chat/booking-${booking.bookingId}`}>
            <MessageSquare className="ml-2 h-4 w-4" /> تواصل مع {relatedUserName}
          </Link>
        </Button>
        
        {currentUserRole === 'client' && booking.status === 'completed' && (
          <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
            <DialogTrigger asChild>
              <Button variant={hasBeenReviewed ? "ghost" : "default"} size="sm" disabled={hasBeenReviewed} className={hasBeenReviewed ? "text-green-600 cursor-default" : ""}>
                <Star className="ml-2 h-4 w-4" /> {hasBeenReviewed ? "تم التقييم" : "تقييم التجربة"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] font-body" dir="rtl">
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl">تقييم تجربة: {experienceTitle}</DialogTitle>
                <DialogDescription>
                  شاركنا رأيك حول هذه التجربة لمساعدة الآخرين.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-6">
                <div>
                  <Label htmlFor="rating" className="block mb-2 text-base">تقييمك (من 5 نجوم):</Label>
                  <div className="flex items-center justify-center gap-1 text-3xl text-amber-400 mb-2" id="rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => handleStarClick(star)} 
                        className="focus:outline-none transition-transform hover:scale-110"
                        aria-label={`تقييم ${star} نجوم`}
                      >
                        <Star className={`cursor-pointer ${currentRating >= star ? 'fill-current' : 'text-muted-foreground/30'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="reviewComment" className="block mb-2 text-base">تعليقك:</Label>
                  <Textarea
                    id="reviewComment"
                    placeholder="اكتب تعليقك هنا..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="min-h-[100px] bg-input focus:bg-background"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
                <Button type="button" onClick={handleReviewSubmit}>إرسال التقييم</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

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
