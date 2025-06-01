"use client";

import { AppHeader } from "@/components/app/app-header";
import { BookingCard } from "@/components/app/booking-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Booking, Experience, User } from "@/models";
import { useMemo } from "react";
import { parseISO } from "date-fns";

const mockHostBookingsData: Booking[] = [
  { bookingId: 'hb1', experienceRef: 'hostExp1', clientRef: 'client1', hostRef: 'host123', bookingDate: parseISO('2024-09-20T10:00:00'), bookingTime: '10:00 ص', numberOfGuests: 2, totalPrice: 240, status: 'pending', paymentStatus: 'pending', createdAt: new Date() },
  { bookingId: 'hb2', experienceRef: 'hostExp2', clientRef: 'client2', hostRef: 'host123', bookingDate: parseISO('2024-09-18T14:00:00'), bookingTime: '02:00 م', numberOfGuests: 1, totalPrice: 250, status: 'confirmed', paymentStatus: 'paid', createdAt: new Date() },
  { bookingId: 'hb3', experienceRef: 'hostExp1', clientRef: 'client3', hostRef: 'host123', bookingDate: parseISO('2024-07-10T18:00:00'), bookingTime: '06:00 م', numberOfGuests: 3, totalPrice: 360, status: 'completed', paymentStatus: 'paid', createdAt: new Date() },
  { bookingId: 'hb4', experienceRef: 'hostExp3', clientRef: 'client4', hostRef: 'host123', bookingDate: parseISO('2024-08-05T09:00:00'), bookingTime: '09:00 ص', numberOfGuests: 2, totalPrice: 800, status: 'cancelled', paymentStatus: 'refunded', createdAt: new Date() },
  { bookingId: 'hb5', experienceRef: 'hostExp2', clientRef: 'client5', hostRef: 'host123', bookingDate: parseISO('2024-09-28T16:00:00'), bookingTime: '04:00 م', numberOfGuests: 4, totalPrice: 1000, status: 'confirmed', paymentStatus: 'paid', createdAt: new Date() },
];

const mockHostExperiencesData: { [key: string]: Partial<Experience> } = {
  hostExp1: { title: 'جولة في مزارع التمر', images: ['https://placehold.co/300x200.png?text=My+Exp+1&font=belleza'], currency: 'ر.س' },
  hostExp2: { title: 'ورشة صناعة الفخار التقليدي', images: ['https://placehold.co/300x200.png?text=My+Exp+2&font=belleza'], currency: 'ر.س' },
  hostExp3: { title: 'مغامرة تسلق الجبال للمبتدئين', images: ['https://placehold.co/300x200.png?text=My+Exp+3&font=belleza'], currency: 'ر.س' },
};

const mockClientUsersData: { [key: string]: Partial<User> } = {
    client1: { displayName: "سارة عبدالله" },
    client2: { displayName: "محمد خالد" },
    client3: { displayName: "فاطمة علي" },
    client4: { displayName: "يوسف أحمد" },
    client5: { displayName: "عائشة حسن" },
};

export default function ManageBookingsPage() {

  const pendingBookings = useMemo(() => 
    mockHostBookingsData.filter(b => b.status === 'pending')
    .sort((a,b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()), 
  []);

  const confirmedBookings = useMemo(() => 
    mockHostBookingsData.filter(b => b.status === 'confirmed')
    .sort((a,b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()), 
  []);

  const completedBookings = useMemo(() => 
    mockHostBookingsData.filter(b => b.status === 'completed')
    .sort((a,b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()), 
  []);
  
  const cancelledBookings = useMemo(() => 
    mockHostBookingsData.filter(b => b.status === 'cancelled')
    .sort((a,b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()),
  []);


  const renderBookingList = (bookings: Booking[]) => {
    if (bookings.length === 0) {
      return <p className="text-center text-muted-foreground py-10 text-lg font-body">لا توجد حجوزات في هذه الفئة.</p>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map(booking => (
          <BookingCard 
            key={booking.bookingId} 
            booking={booking} 
            experience={mockHostExperiencesData[booking.experienceRef]}
            relatedUser={mockClientUsersData[booking.clientRef]}
            currentUserRole="host"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-4xl font-headline text-center mb-10 text-primary">إدارة الحجوزات</h1>

        <Tabs defaultValue="pending" className="w-full font-body" dir="rtl">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8 h-auto bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="pending" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">المعلقة ({pendingBookings.length})</TabsTrigger>
            <TabsTrigger value="confirmed" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">المؤكدة ({confirmedBookings.length})</TabsTrigger>
            <TabsTrigger value="completed" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">المكتملة ({completedBookings.length})</TabsTrigger>
            <TabsTrigger value="cancelled" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">الملغاة ({cancelledBookings.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            {renderBookingList(pendingBookings)}
          </TabsContent>
          <TabsContent value="confirmed">
             {renderBookingList(confirmedBookings)}
          </TabsContent>
           <TabsContent value="completed">
             {renderBookingList(completedBookings)}
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
