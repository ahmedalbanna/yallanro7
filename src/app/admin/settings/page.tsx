
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Settings, DollarSign, Bell, Shield, Save } from "lucide-react";

const settingsSchema = z.object({
  platformName: z.string().min(3, { message: "اسم المنصة يجب أن يكون 3 أحرف على الأقل." }),
  supportEmail: z.string().email({ message: "البريد الإلكتروني للدعم غير صالح." }),
  globalNotificationMessage: z.string().optional(),
  enableVisaMastercard: z.boolean().default(true),
  enableApplePay: z.boolean().default(false),
  enableGooglePay: z.boolean().default(false),
  defaultCurrency: z.string().min(3, { message: "العملة الافتراضية مطلوبة." }).default("ر.س"),
  notifyOnNewUser: z.boolean().default(true),
  notifyOnNewBooking: z.boolean().default(true),
  enableAdminMfa: z.boolean().default(false),
  minPasswordLength: z.coerce.number().min(8, { message: "الحد الأدنى لطول كلمة المرور هو 8." }).default(8),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

// Mock current settings - in a real app, this would be fetched from a backend
const mockCurrentSettings: SettingsFormValues = {
  platformName: "YallaNro7",
  supportEmail: "support@yallanro7.com",
  globalNotificationMessage: "صيانة مجدولة يوم الجمعة الساعة 2 صباحًا.",
  enableVisaMastercard: true,
  enableApplePay: true,
  enableGooglePay: false,
  defaultCurrency: "ر.س",
  notifyOnNewUser: true,
  notifyOnNewBooking: true,
  enableAdminMfa: false,
  minPasswordLength: 10,
};


export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: mockCurrentSettings, // Load mock current settings
  });

  async function onSubmit(values: SettingsFormValues) {
    setIsLoading(true);
    console.log("Admin settings submitted:", values);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);

    toast({
      title: "نجاح!",
      description: "تم حفظ إعدادات المنصة بنجاح.",
    });
    // Optionally, re-fetch settings or update mockCurrentSettings if needed
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-headline text-primary">إعدادات المنصة</h1>
          <p className="text-lg text-muted-foreground font-body mt-2">
            تكوين الإعدادات العامة لمنصة YallaNro7.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            <Card className="shadow-lg rounded-xl border-primary/10">
              <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center"><Settings className="ml-2 h-6 w-6 text-primary" /> الإعدادات العامة للمنصة</CardTitle>
                <CardDescription className="font-body">تعديل المعلومات الأساسية للمنصة.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 font-body">
                <FormField
                  control={form.control}
                  name="platformName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المنصة</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: YallaNro7" {...field} className="h-11 bg-input focus:bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supportEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني للدعم</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="support@example.com" {...field} className="h-11 bg-input focus:bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="globalNotificationMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رسالة إشعار عامة (اختياري)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="رسالة تظهر لجميع المستخدمين..." {...field} className="min-h-[80px] bg-input focus:bg-background" />
                      </FormControl>
                      <FormDescription>
                        يمكن استخدامها لإعلانات الصيانة أو التحديثات الهامة.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-xl border-primary/10">
              <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center"><DollarSign className="ml-2 h-6 w-6 text-primary" /> إعدادات الدفع</CardTitle>
                <CardDescription className="font-body">إدارة خيارات الدفع والعملات.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 font-body">
                <FormField
                  control={form.control}
                  name="enableVisaMastercard"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-input/30">
                      <div className="space-y-0.5">
                        <FormLabel>تفعيل Visa/Mastercard</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="enableApplePay"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-input/30">
                      <div className="space-y-0.5">
                        <FormLabel>تفعيل Apple Pay</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="enableGooglePay"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-input/30">
                      <div className="space-y-0.5">
                        <FormLabel>تفعيل Google Pay</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultCurrency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>العملة الافتراضية</FormLabel>
                      <Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 bg-input focus:bg-background">
                            <SelectValue placeholder="اختر العملة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ر.س" className="font-body">ريال سعودي (ر.س)</SelectItem>
                          <SelectItem value="USD" className="font-body">دولار أمريكي (USD)</SelectItem>
                          <SelectItem value="EUR" className="font-body">يورو (EUR)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card className="shadow-lg rounded-xl border-primary/10">
              <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center"><Bell className="ml-2 h-6 w-6 text-primary" /> إعدادات الإشعارات</CardTitle>
                <CardDescription className="font-body">التحكم في إشعارات البريد الإلكتروني.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 font-body">
                <FormField
                  control={form.control}
                  name="notifyOnNewUser"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-input/30">
                      <div className="space-y-0.5">
                        <FormLabel>إشعار عند تسجيل مستخدم جديد</FormLabel>
                        <FormDescription className="text-xs">
                          إرسال بريد ترحيبي للمستخدمين الجدد.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notifyOnNewBooking"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-input/30">
                      <div className="space-y-0.5">
                        <FormLabel>إشعار عند إنشاء حجز جديد</FormLabel>
                         <FormDescription className="text-xs">
                           إرسال تأكيد للعميل والمضيف.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

             <Card className="shadow-lg rounded-xl border-primary/10">
              <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center"><Shield className="ml-2 h-6 w-6 text-primary" /> إعدادات الأمان</CardTitle>
                <CardDescription className="font-body">إدارة سياسات الأمان للمنصة.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 font-body">
                <FormField
                  control={form.control}
                  name="enableAdminMfa"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-input/30">
                      <div className="space-y-0.5">
                        <FormLabel>تفعيل المصادقة الثنائية (MFA) للمسؤولين</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="minPasswordLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الحد الأدنى لطول كلمة المرور</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="مثال: 8" {...field} className="h-11 bg-input focus:bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>


            <div className="flex justify-end pt-6 border-t">
                <Button type="submit" size="lg" className="text-base py-3 h-12" disabled={isLoading}>
                    <Save className="ml-2 h-5 w-5" />
                    {isLoading ? "جاري الحفظ..." : "حفظ جميع التغييرات"}
                </Button>
            </div>
          </form>
        </Form>
      </main>
      <footer className="py-8 border-t bg-card mt-12">
        <div className="container text-center text-sm text-muted-foreground font-body">
          © {new Date().getFullYear()} YallaNro7. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}

    