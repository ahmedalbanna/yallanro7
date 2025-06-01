
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Eye, EyeOff, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/models";

const loginSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." }),
});

const roles: [User['role'], ...User['role'][]] = ['client', 'host', 'admin'];

const registerSchema = z.object({
  displayName: z.string().min(2, { message: "الاسم يجب أن يكون حرفين على الأقل."}),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." }),
  confirmPassword: z.string().min(6, { message: "تأكيد كلمة المرور مطلوب." }),
  role: z.enum(roles, { required_error: "يرجى اختيار الدور."}),
}).refine(data => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين.",
  path: ["confirmPassword"],
});


export function AuthForm() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const formSchema = isLoginMode ? loginSchema : registerSchema;
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isLoginMode 
      ? { email: "", password: "" } 
      : { displayName: "", email: "", password: "", confirmPassword: "", role: "client" },
  });

  function onSubmit(values: FormValues) {
    console.log("AuthForm submission:", values);
    if (!isLoginMode) {
        const registerValues = values as z.infer<typeof registerSchema>;
        console.log("Registering with role:", registerValues.role);
        // Here you would typically call your backend API
        // For mock: update AppHeader state or global state
        // For now, we'll just toast and log.
    }
    toast({
      title: `تم ${isLoginMode ? 'تسجيل الدخول' : 'إنشاء الحساب'} بنجاح!`,
      description: isLoginMode ? "سيتم توجيهك الآن..." : `تم إنشاء حساب كـ ${ (values as z.infer<typeof registerSchema>).role}. سيتم توجيهك...`,
      variant: "default"
    });
    // Simulate updating AppHeader state for demonstration - this is a simplified mock
    // In a real app, this would involve actual authentication and context/state updates
    // For prototype purposes, this console log is the primary outcome.
    // User can manually change AppHeader mocks to test different roles.
  }

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    form.reset(isLoginMode 
      ? { displayName: "", email: "", password: "", confirmPassword: "", role: "client" } 
      : { email: "", password: "" });
  }

  return (
    <>
      <h2 className="text-3xl font-headline text-center mb-2">
        {isLoginMode ? "تسجيل الدخول" : "إنشاء حساب جديد"}
      </h2>
      <p className="text-muted-foreground text-center mb-6 font-body text-sm">
        {isLoginMode ? "مرحباً بعودتك! أدخل بياناتك للمتابعة." : "املأ الحقول التالية للانضمام إلينا."}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 font-body">
          {!isLoginMode && (
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الكامل</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: خالد الأحمد" {...field} className="h-11 bg-input focus:bg-background"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@email.com" {...field} className="h-11 bg-input focus:bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>كلمة المرور</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} className="h-11 bg-input focus:bg-background pr-10" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isLoginMode && (
            <>
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تأكيد كلمة المرور</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} className="h-11 bg-input focus:bg-background pr-10"/>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>أرغب بالتسجيل كـ</FormLabel>
                    <Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-input focus:bg-background">
                          <UserCheck className="ml-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="اختر دورك" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="client">عميل (أبحث عن تجارب)</SelectItem>
                        <SelectItem value="host">مضيف (أقدم تجارب)</SelectItem>
                        {/* Admin role might not be self-selectable in a real app */}
                        {/* <SelectItem value="admin">مسؤول</SelectItem> */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {isLoginMode && (
            <div className="text-sm text-right">
              <Link href="/forgot-password" passHref> {/* Add forgot-password page later */}
                <Button variant="link" className="p-0 h-auto font-body text-primary hover:underline">
                  هل نسيت كلمة المرور؟
                </Button>
              </Link>
            </div>
          )}
          
          <Button type="submit" className="w-full text-base py-3 h-12 font-body">
            {isLoginMode ? "تسجيل الدخول" : "إنشاء حساب"}
          </Button>
          
          <div className="text-center text-sm">
            <Button type="button" variant="link" onClick={toggleMode} className="font-body text-primary hover:underline">
              {isLoginMode ? "ليس لديك حساب؟ إنشاء حساب جديد" : "لديك حساب بالفعل؟ تسجيل الدخول"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
