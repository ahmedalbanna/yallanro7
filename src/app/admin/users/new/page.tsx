
"use client";

import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { User } from "@/models";
import { UserPlus, Mail, Lock, UserCog as UserRoleIcon } from "lucide-react"; // Added icons

const roles: [User['role'], ...User['role'][]] = ['client', 'host', 'admin'];

const addUserSchema = z.object({
  displayName: z.string().min(2, { message: "الاسم يجب أن يكون حرفين على الأقل."}),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." }),
  role: z.enum(roles, { required_error: "يرجى اختيار الدور."}),
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

export default function AddNewUserPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      role: "client",
    },
  });

  async function onSubmit(values: AddUserFormValues) {
    setIsLoading(true);
    console.log("Admin adding new user:", values);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);

    toast({
      title: "نجاح!",
      description: `تمت إضافة المستخدم "${values.displayName}" بنجاح.`,
    });
    router.push("/admin/users"); // Redirect to users list
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto py-8 sm:py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl rounded-xl border-primary/10">
            <CardHeader className="text-center">
              <UserPlus className="mx-auto h-12 w-12 text-primary mb-3" />
              <CardTitle className="text-3xl font-headline">إضافة مستخدم جديد</CardTitle>
              <CardDescription className="font-body text-muted-foreground">
                أدخل تفاصيل المستخدم الجديد ليتم إضافته إلى المنصة.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6 p-6 sm:p-8 font-body">
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><UserRoleIcon className="ml-2 h-4 w-4 text-muted-foreground"/> الاسم الكامل</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: خالد الأحمد" {...field} className="h-11 bg-input focus:bg-background text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Mail className="ml-2 h-4 w-4 text-muted-foreground"/> البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="example@email.com" {...field} className="h-11 bg-input focus:bg-background text-base" />
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
                        <FormLabel className="flex items-center"><Lock className="ml-2 h-4 w-4 text-muted-foreground"/> كلمة المرور</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="h-11 bg-input focus:bg-background text-base" />
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
                        <FormLabel className="flex items-center"><UserRoleIcon className="ml-2 h-4 w-4 text-muted-foreground"/> دور المستخدم</FormLabel>
                        <Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 bg-input focus:bg-background text-base">
                              <SelectValue placeholder="اختر دور المستخدم" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="client" className="font-body">عميل</SelectItem>
                            <SelectItem value="host" className="font-body">مضيف</SelectItem>
                            <SelectItem value="admin" className="font-body">مسؤول</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="p-6 sm:p-8 border-t">
                  <Button type="submit" size="lg" className="w-full text-base py-3 h-12" disabled={isLoading}>
                    {isLoading ? "جاري الإضافة..." : "إضافة المستخدم"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </main>
      <footer className="py-8 border-t bg-card mt-12">
        <div className="container text-center text-sm text-muted-foreground font-body">
          © {new Date().getFullYear()} YallaNro7. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}

