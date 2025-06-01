"use client";

import { AppHeader } from "@/components/app/app-header";
import { BookingCard } from "@/components/app/booking-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Booking, Experience, User } from "@/models";
import { useState, useMemo } from "react";
import { parseISO } from "date-fns";

const mockBookingsData: Booking[] = [
  { bookingId: 'b1', experienceRef: 'exp1', clientRef: 'user1', hostRef: 'host1', bookingDate: parseISO('2024-09-20T10:00:00'), bookingTime: '10:00 ص', numberOfGuests: 2, totalPrice: 700, status: 'confirmed', paymentStatus: 'paid', createdAt: new Date() },
  { bookingId: 'b2', experienceRef: 'exp2', clientRef: 'user1', hostRef: 'host2', bookingDate: parseISO('2024-07-15T14:00:00'), bookingTime: '02:00 م', numberOfGuests: 1, totalPrice: 150, status: 'completed', paymentStatus: 'paid', createdAt: new Date() },
  { bookingId: 'b3', experienceRef: 'exp3', clientRef: 'user1', hostRef: 'host3', bookingDate: parseISO('2024-09-25T18:00:00'), bookingTime: '06:00 م', numberOfGuests: 4, totalPrice: 600, status: 'pending', paymentStatus: 'pending', createdAt: new Date() },
  { bookingId: 'b4', experienceRef: 'exp4', clientRef: 'user1', hostRef: 'host4', bookingDate: parseISO('2024-06-10T09:00:00'), bookingTime: '09:00 ص', numberOfGuests: 2, totalPrice: 400, status: 'cancelled', paymentStatus: 'paid', createdAt: new Date() },
  { bookingId: 'b5', experienceRef: 'exp1', clientRef: 'user1', hostRef: 'host1', bookingDate: parseISO('2024-10-05T16:00:00'), bookingTime: '04:00 م', numberOfGuests: 3, totalPrice: 1050, status: 'confirmed', paymentStatus: 'paid', createdAt: new Date() },
];

const mockExperiencesData: { [key: string]: Partial<Experience> } = {
  exp1: { title: 'رحلة سفاري صحراوية', images: ['https://placehold.co/300x200.png?text=Safari&font=belleza'], currency: 'ر.س' },
  exp2: { title: 'دورة طبخ إيطالي', images: ['https://placehold.co/300x200.png?text=Cooking&font=belleza'], currency: 'ر.س' },
  exp3: { title: 'ورشة رسم بالألوان المائية', images: ['https://placehold.co/300x200.png?text=Art&font=belleza'], currency: 'ر.س' },
  exp4: { title: 'جولة تاريخية في المدينة القديمة', images: ['https://placehold.co/300x200.png?text=History&font=belleza'], currency: 'ر.س' },
};

const mockUsersData: { [key: string]: Partial<User> } = {
    host1: { displayName: "أحمد المستكشف" },
    host2: { displayName: "الشيف ماريا" },
    host3: { displayName: "الفنانة نورة" },
    host4: { displayName: "المرشد خالد" },
};

export default function MyBookingsPage() {
  const now = new Date();

  const upcomingBookings = useMemo(() => 
    mockBookingsData.filter(b => (b.status === 'confirmed' || b.status === 'pending') && new Date(b.bookingDate) >= now)
    .sort((a,b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()), 
  [now]);

  const pastBookings = useMemo(() => 
    mockBookingsData.filter(b => b.status === 'completed' || ( (b.status === 'confirmed' || b.status === 'cancelled') && new Date(b.bookingDate) < now))
    .sort((a,b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()), 
  [now]);
  
  const cancelledBookings = useMemo(() => 
    mockBookingsData.filter(b => b.status === 'cancelled' && new Date(b.bookingDate) >= now) // Only show recently cancelled upcoming
    .sort((a,b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()),
  [now]);


  const renderBookingList = (bookings: Booking[]) => {
    if (bookings.length === 0) {
      return <p className="text-center text-muted-foreground py-10 text-lg font-body">ليس لديك حجوزات في هذه الفئة.</p>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map(booking => (
          <BookingCard 
            key={booking.bookingId} 
            booking={booking} 
            experience={mockExperiencesData[booking.experienceRef]}
            relatedUser={mockUsersData[booking.hostRef]}
            currentUserRole="client"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-4xl font-headline text-center mb-10 text-primary">حجوزاتي</h1>

        <Tabs defaultValue="upcoming" className="w-full font-body" dir="rtl">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-auto bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="upcoming" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">القادمة ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="past" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">السابقة ({pastBookings.length})</TabsTrigger>
            <TabsTrigger value="cancelled" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">الملغاة ({cancelledBookings.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {renderBookingList(upcomingBookings)}
          </TabsContent>
          <TabsContent value="past">
             {renderBookingList(pastBookings)}
          </TabsContent>
          <TabsContent value="cancelled">
            {renderBookingList(cancelledBookings)}
          </TabsContent>
        </Tabs>
      </main>
      <footer className="py-8 border-t bg-card mt-12">
        <div className="container text-center text-sm text-muted-foreground font-body">
          © {new Date().getFullYear()} YallaNro7. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
