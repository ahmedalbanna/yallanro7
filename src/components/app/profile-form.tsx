"use client";

import type { User } from "@/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormProps {
  user: User;
}

const profileSchema = z.object({
  displayName: z.string().min(2, { message: "الاسم يجب أن يكون حرفين على الأقل." }).max(50, { message: "الاسم طويل جداً."}),
  phoneNumber: z.string().optional().refine(val => !val || /^(05\d{8})$|^(\+9665\d{8})$/.test(val.replace(/\s+/g, '')), { // Basic Saudi number validation
    message: "رقم الهاتف غير صالح. استخدم الصيغة 05xxxxxxxx أو +9665xxxxxxxx",
  }),
  bio: z.string().max(500, { message: "النبذة التعريفية طويلة جداً (الحد الأقصى 500 حرف)."}).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm({ user }: ProfileFormProps) {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user.displayName || "",
      phoneNumber: user.phoneNumber || "",
      bio: user.bio || "",
    },
  });

  function onSubmit(values: ProfileFormValues) {
    console.log("Profile updated:", values);
    // TODO: Implement actual profile update logic to backend
    toast({
      title: "تم بنجاح!",
      description: "تم تحديث معلومات ملفك الشخصي.",
      variant: "default", // Or use a success variant if defined
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 font-body">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">الاسم المعروض</FormLabel>
              <FormControl>
                <Input placeholder="اسمك الذي سيظهر للآخرين" {...field} className="text-base py-3 h-12 bg-input focus:bg-background" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">رقم الهاتف (اختياري)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="05xxxxxxxx" {...field} className="text-base py-3 h-12 bg-input focus:bg-background" dir="ltr" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {user.role === 'host' && (
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">نبذة تعريفية (للمضيفين)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="شارك نبذة عنك وعن شغفك بالتجارب التي تقدمها."
                    className="resize-none min-h-[120px] text-base py-3 bg-input focus:bg-background"
                    {...field}
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" size="lg" className="w-full sm:w-auto text-base py-3 h-12">
          حفظ التغييرات
        </Button>
      </form>
    </Form>
  );
}
