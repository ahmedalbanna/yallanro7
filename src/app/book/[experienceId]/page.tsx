"use client";

import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, Users, Clock, CreditCard, Minus, Plus, AlertTriangle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import React, { useState, useEffect } from "react";
import type { Experience } from "@/models";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

const mockExperience: Experience = {
  experienceId: 'exp1',
  title: 'رحلة سفاري صحراوية مثيرة مع عشاء تقليدي',
  images: ['https://placehold.co/600x400.png?text=Safari&font=belleza'],
  price: 350,
  currency: 'ر.س',
  availableDates: ['2024-09-15', '2024-09-16', '2024-09-22', '2024-09-23', '2024-10-01'],
  availableTimes: ['03:00 PM', '04:00 PM', '05:00 PM'],
  maxGuests: 5,
  description: '', activities: [], duration: '', location: {lat:0, lng:0}, address: '', city: '', categoryRef: '', hostRef: '', isActive: true, createdAt: new Date(), updatedAt: new Date()
};

interface BookingProcessPageProps {
  params: { experienceId: string };
}

export default function BookingProcessPage({ params }: BookingProcessPageProps) {
  const { experienceId } = params;
  const experience = mockExperience; 
  const router = useRouter();
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(experience.price);
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");

  useEffect(() => {
    setTotalPrice(experience.price * numberOfGuests);
  }, [numberOfGuests, experience.price]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined); 
  };

  const handleGuestChange = (change: number) => {
    setNumberOfGuests(prev => {
      const newGuests = prev + change;
      if (newGuests < 1) return 1;
      if (newGuests > experience.maxGuests) {
        toast({
            title: "تنبيه",
            description: `الحد الأقصى لعدد الضيوف هو ${experience.maxGuests}.`,
            variant: "default",
        });
        return experience.maxGuests;
      }
      return newGuests;
    });
  };
  
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      toast({
        title: "خطأ في الإدخال",
        description: "الرجاء تحديد التاريخ والوقت.",
        variant: "destructive",
      });
      return;
    }
    
    console.log({ experienceId, selectedDate, selectedTime, numberOfGuests, totalPrice, paymentMethod });
    
    // Simulate payment success for demo
    const paymentSuccess = true; 

    if (paymentSuccess) {
        toast({
            title: "جاري معالجة الحجز...",
            description: "سيتم توجيهك لصفحة التأكيد قريباً.",
        });
        router.push(`/payment-confirmation?status=success&experienceTitle=${encodeURIComponent(experience.title)}&date=${selectedDate.toISOString()}&time=${encodeURIComponent(selectedTime)}&guests=${numberOfGuests}&total=${totalPrice}&currency=${encodeURIComponent(experience.currency)}`);
    } else {
        router.push(`/payment-confirmation?status=failed&experienceTitle=${encodeURIComponent(experience.title)}`);
    }
  };
  
  const availableDatesObjects = experience.availableDates.map(dateStr => parseISO(dateStr));
  const today = new Date();
  today.setHours(0,0,0,0); // Ensure comparison is for date only, not time

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-4xl font-headline text-center mb-10 text-primary">إتمام عملية الحجز</h1>
        
        <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-xl rounded-xl border-primary/10">
              <CardHeader>
                <CardTitle className="text-2xl font-headline">1. تفاصيل التجربة</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-6 items-start font-body">
                <Image
                  src={experience.images[0]}
                  alt={experience.title}
                  width={150}
                  height={100}
                  className="rounded-lg object-cover aspect-[3/2] border"
                  data-ai-hint="adventure activity"
                />
                <div>
                  <h3 className="text-xl font-semibold">{experience.title}</h3>
                  <p className="text-lg text-primary font-bold mt-1">{experience.price} {experience.currency} / للشخص</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <Link href={`/experiences/${experienceId}`} className="hover:underline text-accent">
                      عرض تفاصيل التجربة كاملة
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl rounded-xl border-primary/10">
              <CardHeader>
                <CardTitle className="text-2xl font-headline">2. اختر التاريخ والوقت</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="date-picker" className="text-base font-body mb-2 block">التاريخ المتاح</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-picker"
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal h-12 text-base bg-input focus:bg-background ${!selectedDate && "text-muted-foreground"}`}
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP", { locale: arSA }) : <span>اختر تاريخاً</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => 
                            !availableDatesObjects.some(availableDate => 
                                date.getFullYear() === availableDate.getFullYear() &&
                                date.getMonth() === availableDate.getMonth() &&
                                date.getDate() === availableDate.getDate()
                            ) || date < today 
                        }
                        initialFocus
                        locale={arSA}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {selectedDate && (
                  <div>
                    <Label htmlFor="time-select" className="text-base font-body mb-2 block">الوقت المتاح</Label>
                    <Select dir="rtl" onValueChange={setSelectedTime} value={selectedTime}>
                      <SelectTrigger id="time-select" className="h-12 text-base bg-input focus:bg-background">
                        <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="اختر وقتاً" />
                      </SelectTrigger>
                      <SelectContent>
                        {experience.availableTimes.map(time => (
                          <SelectItem key={time} value={time} className="text-base font-body">
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-xl rounded-xl border-primary/10">
              <CardHeader>
                <CardTitle className="text-2xl font-headline">3. عدد الضيوف</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between font-body">
                <Label htmlFor="guest-count" className="text-base">الضيوف (الحد الأقصى: {experience.maxGuests})</Label>
                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" size="icon" onClick={() => handleGuestChange(-1)} disabled={numberOfGuests <= 1} aria-label="تقليل عدد الضيوف">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span id="guest-count" className="text-xl font-bold w-8 text-center tabular-nums">{numberOfGuests}</span>
                  <Button type="button" variant="outline" size="icon" onClick={() => handleGuestChange(1)} disabled={numberOfGuests >= experience.maxGuests} aria-label="زيادة عدد الضيوف">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl rounded-xl border-primary/10">
              <CardHeader>
                <CardTitle className="text-2xl font-headline">4. تفاصيل الدفع</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup defaultValue="credit_card" onValueChange={setPaymentMethod} className="font-body">
                  <Label className="text-base mb-2 block">اختر طريقة الدفع</Label>
                  {["credit_card", "apple_pay", "google_pay"].map(method => (
                    <div key={method} className="flex items-center space-x-2 space-x-reverse p-3 border rounded-md has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-all">
                      <RadioGroupItem value={method} id={method} />
                      <Label htmlFor={method} className="flex-1 cursor-pointer text-base">
                        {method === "credit_card" && "بطاقة ائتمانية/مدى"}
                        {method === "apple_pay" && "Apple Pay"}
                        {method === "google_pay" && "Google Pay"}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {paymentMethod === "credit_card" && (
                  <div className="space-y-4 pt-4 border-t font-body">
                    <div>
                      <Label htmlFor="card-number" className="text-base">رقم البطاقة</Label>
                      <Input id="card-number" placeholder="xxxx xxxx xxxx xxxx" className="h-12 text-base mt-1 bg-input focus:bg-background" dir="ltr"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry-date" className="text-base">تاريخ الانتهاء</Label>
                        <Input id="expiry-date" placeholder="MM/YY" className="h-12 text-base mt-1 bg-input focus:bg-background" dir="ltr"/>
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-base">CVV</Label>
                        <Input id="cvv" placeholder="•••" className="h-12 text-base mt-1 bg-input focus:bg-background" dir="ltr"/>
                      </div>
                    </div>
                     <div>
                      <Label htmlFor="card-holder" className="text-base">اسم صاحب البطاقة</Label>
                      <Input id="card-holder" placeholder="الاسم كما هو على البطاقة" className="h-12 text-base mt-1 bg-input focus:bg-background"/>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 relative">
            <Card className="shadow-2xl rounded-xl sticky top-24 border-2 border-primary/50 bg-card">
              <CardHeader className="bg-primary/5 p-5">
                <CardTitle className="text-2xl font-headline text-center">ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 font-body">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">سعر التجربة (x{numberOfGuests})</span>
                  <span className="font-semibold">{experience.price * numberOfGuests} {experience.currency}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>رسوم الخدمة والضرائب</span>
                  <span className="font-semibold">0 {experience.currency}</span> {/* Placeholder */}
                </div>
                <hr className="border-dashed"/>
                <div className="flex justify-between items-center text-xl font-bold text-primary">
                  <span>الإجمالي</span>
                  <span>{totalPrice} {experience.currency}</span>
                </div>
              </CardContent>
              <CardFooter className="p-5 flex-col gap-3 border-t">
                <Button type="submit" size="lg" className="w-full text-lg py-3 h-14 font-body">
                  <CreditCard className="ml-2 h-5 w-5" />
                  تأكيد الحجز والدفع
                </Button>
                <p className="text-xs text-muted-foreground text-center font-body">
                  بالضغط على "تأكيد الحجز والدفع"، أنت توافق على <Link href="/terms" className="underline hover:text-accent">شروط الخدمة</Link>.
                </p>
              </CardFooter>
            </Card>
          </div>
        </form>
      </main>
      <footer className="py-8 border-t bg-card mt-12">
        <div className="container text-center text-sm text-muted-foreground font-body">
          © {new Date().getFullYear()} YallaNro7. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
