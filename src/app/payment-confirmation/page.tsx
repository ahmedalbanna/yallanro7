"use client";

import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle, XCircle, CalendarDays, Users, Tag, BadgeDollarSign } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { Suspense } from "react";
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";

function PaymentConfirmationContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const experienceTitle = searchParams.get('experienceTitle');
  const dateStr = searchParams.get('date');
  const time = searchParams.get('time');
  const guests = searchParams.get('guests');
  const total = searchParams.get('total');
  const currency = searchParams.get('currency') || 'ر.س';
  
  const isSuccess = status === 'success';
  const bookingDate = dateStr ? parseISO(dateStr) : null;

  return (
    <main className="flex-1 container mx-auto py-12 px-4 flex items-center justify-center">
      <Card className="w-full max-w-lg shadow-xl rounded-xl text-center border-primary/10">
        <CardHeader className="pt-10 px-6">
          {isSuccess ? (
            <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-4 animate-pulse" />
          ) : (
            <XCircle className="mx-auto h-20 w-20 text-destructive mb-4" />
          )}
          <CardTitle className="text-3xl md:text-4xl font-headline">
            {isSuccess ? "تم تأكيد الحجز بنجاح!" : "فشلت عملية الدفع"}
          </CardTitle>
          <CardDescription className="text-lg font-body mt-2 text-foreground/80">
            {isSuccess
              ? "شكراً لك! تم تأكيد حجزك. ستتلقى رسالة بريد إلكتروني تحتوي على التفاصيل قريباً."
              : "عذراً، حدث خطأ أثناء معالجة عملية الدفع. يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني."}
          </CardDescription>
        </CardHeader>
        {isSuccess && experienceTitle && bookingDate && time && guests && total && (
          <CardContent className="space-y-4 p-6 font-body text-right">
            <h3 className="text-xl font-headline text-center mb-4 border-b pb-3 text-primary">ملخص الحجز</h3>
            <div className="p-4 bg-muted/30 rounded-lg space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold flex items-center"><Tag className="ml-2 h-5 w-5 text-accent"/> التجربة:</span>
                <span className="font-medium">{decodeURIComponent(experienceTitle)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold flex items-center"><CalendarDays className="ml-2 h-5 w-5 text-accent"/> التاريخ والوقت:</span>
                <span className="font-medium">{format(bookingDate, "PPP", { locale: arSA })} - {decodeURIComponent(time)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold flex items-center"><Users className="ml-2 h-5 w-5 text-accent"/> عدد الضيوف:</span>
                <span className="font-medium">{guests}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold text-primary border-t pt-3 mt-3">
                <span className="flex items-center"><BadgeDollarSign className="ml-2 h-5 w-5"/>الإجمالي المدفوع:</span>
                <span>{total} {decodeURIComponent(currency)}</span>
              </div>
            </div>
          </CardContent>
        )}
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center p-6 border-t bg-muted/20">
          {isSuccess ? (
            <Button asChild size="lg" className="font-body text-base h-12 flex-1">
              <Link href="/my-bookings">عرض حجوزاتي</Link>
            </Button>
          ) : (
             <Button asChild size="lg" variant="outline" className="font-body text-base h-12 flex-1 border-border hover:bg-accent/10 hover:border-accent/50">
              <Link href="/#">العودة للرئيسية</Link> {/* Or back to booking page */}
            </Button>
          )}
          <Button asChild size="lg" variant={isSuccess ? "outline" : "default"} className="font-body text-base h-12 flex-1 border-border hover:bg-accent/10 hover:border-accent/50">
            <Link href="/#">تصفح المزيد من التجارب</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

export default function PaymentConfirmationPage() {
 return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><p className="text-lg font-body text-primary">جار التحميل...</p></div>}>
        <PaymentConfirmationContent />
      </Suspense>
      <footer className="py-8 border-t bg-card mt-auto">
        <div className="container text-center text-sm text-muted-foreground font-body">
          © {new Date().getFullYear()} YallaNro7. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
