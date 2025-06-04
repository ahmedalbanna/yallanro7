
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, CheckCheck, Circle, ExternalLink, Mail, MessageSquare, PackageCheck, ShoppingBag, AlertTriangle, Sparkles, X } from "lucide-react";
import type { NotificationItem } from "@/models";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

const mockNotificationsData: NotificationItem[] = [
  {
    id: 'notif1',
    title: 'تأكيد الحجز #EXP789',
    description: 'تم تأكيد حجزك لرحلة السفاري الصحراوية. نتطلع لرؤيتك!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
    type: 'booking',
    link: '/my-bookings',
  },
  {
    id: 'notif2',
    title: 'رسالة جديدة من المضيف أحمد',
    description: 'أحمد: "مرحباً! هل لديك أي أسئلة بخصوص التجربة؟"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: true,
    type: 'message',
    link: '/chat/booking-mockbookingid', // Example link
  },
  {
    id: 'notif3',
    title: 'تحديث على تجربة "دورة الطهي"',
    description: 'تم إضافة تواريخ جديدة لتجربة دورة الطهي التي تتابعها.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: false,
    type: 'experience_update',
    link: '/experiences/exp-cooking-mock', // Example link
  },
  {
    id: 'notif4',
    title: 'صيانة مجدولة',
    description: 'سيتم إجراء صيانة للمنصة يوم الجمعة القادم من الساعة 2 صباحًا حتى 3 صباحًا.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    isRead: true,
    type: 'system_alert',
  },
  {
    id: 'notif5',
    title: 'ميزة جديدة: قائمة الأمنيات!',
    description: 'يمكنك الآن إضافة التجارب المفضلة لديك إلى قائمة الأمنيات للوصول إليها لاحقًا بسهولة.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    isRead: false,
    type: 'new_feature',
    link: '/#',
  },
   {
    id: 'notif6',
    title: 'حجزك #EXP123 تم إلغاؤه',
    description: 'للأسف، تم إلغاء حجزك لـ "جولة القوارب الشراعية" بسبب سوء الأحوال الجوية. تم استرداد المبلغ بالكامل.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    isRead: false,
    type: 'booking',
  },
];

const getNotificationIcon = (type: NotificationItem['type']): React.ElementType => {
  switch (type) {
    case 'booking': return ShoppingBag;
    case 'message': return MessageSquare;
    case 'experience_update': return PackageCheck;
    case 'system_alert': return AlertTriangle;
    case 'new_feature': return Sparkles;
    default: return Bell;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotificationsData);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
    toast({ title: "تم تحديد الإشعار كمقروء" });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast({ title: "تم تحديد جميع الإشعارات كمقروءة" });
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({ title: "تم حذف الإشعار", variant: "destructive" });
  };


  return (
    <main className="flex-1 container mx-auto py-8 sm:py-12 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-headline text-primary">الإشعارات</h1>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline" size="sm" className="font-body">
            <CheckCheck className="ml-2 h-4 w-4" />
            تحديد الكل كمقروء ({unreadCount})
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="text-center py-16 shadow-lg rounded-xl border-primary/10">
          <CardHeader>
            <Bell className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl font-headline">لا توجد إشعارات جديدة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground font-body">ستظهر إشعاراتك هنا عند توفرها.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map(notif => {
            const IconComponent = getNotificationIcon(notif.type);
            const timeAgo = formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true, locale: arSA });

            return (
              <Card
                key={notif.id}
                className={cn(
                  "shadow-md rounded-xl transition-all duration-300 ease-in-out",
                  notif.isRead ? "bg-card/70 opacity-80 hover:opacity-100" : "bg-card border-primary/20 hover:shadow-xl",
                )}
              >
                <CardContent className="p-4 sm:p-5 flex items-start gap-4 relative">
                  {!notif.isRead && (
                    <Circle fill="hsl(var(--primary))" className="absolute top-3 right-3 h-2.5 w-2.5 text-primary" aria-label="إشعار غير مقروء" />
                  )}
                  <div className={cn("p-2.5 rounded-full bg-primary/10", notif.isRead && "bg-muted")}>
                     <IconComponent className={cn("h-6 w-6", notif.isRead ? "text-muted-foreground" : "text-primary")} />
                  </div>
                 
                  <div className="flex-grow">
                    <h3 className={cn("font-semibold font-headline text-base sm:text-lg mb-0.5", notif.isRead && "text-muted-foreground")}>{notif.title}</h3>
                    <p className={cn("text-sm font-body text-foreground/80", notif.isRead ? "text-muted-foreground/80" : "text-foreground/90")}>{notif.description}</p>
                    <p className={cn("text-xs mt-2", notif.isRead ? "text-muted-foreground/70" : "text-muted-foreground")}>{timeAgo}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0 pt-1">
                     {!notif.isRead && (
                        <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notif.id)} className={cn("text-xs h-auto p-1.5 font-body", !notif.isRead && "text-primary hover:text-primary/80")}>
                          <Check className="ml-1 h-3.5 w-3.5"/> تحديد كمقروء
                        </Button>
                    )}
                     {notif.link && (
                      <Button variant="link" size="sm" asChild className="text-xs h-auto p-1.5 font-body text-accent hover:text-accent/80">
                        <Link href={notif.link}>
                          عرض التفاصيل <ExternalLink className="mr-1 h-3.5 w-3.5"/>
                        </Link>
                      </Button>
                    )}
                     <Button variant="ghost" size="icon" onClick={() => handleDeleteNotification(notif.id)} className="h-7 w-7 text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                        <span className="sr-only">حذف الإشعار</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
        {notifications.length > 10 && ( /* Pagination placeholder */
            <div className="mt-8 flex justify-center">
                <Button variant="outline" className="font-body">تحميل المزيد من الإشعارات</Button>
            </div>
        )}
    </main>
  );
}
