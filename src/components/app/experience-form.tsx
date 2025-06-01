
"use client";

import type { Experience, Category, City } from "@/models";
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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, List, MapPinIcon, TagIcon, Image as ImageIcon, CalendarDays, ClockIcon, Users, CheckSquare } from "lucide-react";

interface ExperienceFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<Experience>;
  categories: Category[];
  cities: City[];
  onSubmitHandler: (data: ExperienceFormValues) => void;
  isLoading?: boolean;
}

const experienceFormSchema = z.object({
  title: z.string().min(5, { message: "عنوان التجربة يجب أن يكون 5 أحرف على الأقل." }).max(100, {message: "العنوان طويل جداً."}),
  description: z.string().min(20, { message: "وصف التجربة يجب أن يكون 20 حرف على الأقل." }).max(2000, {message: "الوصف طويل جداً."}),
  price: z.coerce.number().positive({ message: "السعر يجب أن يكون رقماً موجباً." }),
  currency: z.string().min(2, {message: "العملة مطلوبة."}).default("ر.س"),
  duration: z.string().min(1, { message: "مدة التجربة مطلوبة." }),
  maxGuests: z.coerce.number().int().min(1, { message: "الحد الأدنى لعدد الضيوف هو 1." }),
  city: z.string().min(1, { message: "المدينة مطلوبة."}),
  categoryRef: z.string().min(1, { message: "الفئة مطلوبة."}),
  address: z.string().min(5, { message: "العنوان التفصيلي مطلوب."}),
  activities: z.string().min(1, {message: "اذكر نشاطاً واحداً على الأقل. افصل بين الأنشطة بفاصلة."}),
  images: z.string().min(1, {message: "أضف رابط صورة واحدة على الأقل. افصل بين الروابط بفاصلة."}),
  availableDates: z.string().min(1, {message: "أضف تاريخاً متاحاً واحداً على الأقل (YYYY-MM-DD). افصل بفاصلة."}),
  availableTimes: z.string().min(1, {message: "أضف وقتاً متاحاً واحداً على الأقل (HH:MM AM/PM). افصل بفاصلة."}),
  isActive: z.boolean().default(true),
});

export type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

export function ExperienceForm({ mode, initialData, categories, cities, onSubmitHandler, isLoading }: ExperienceFormProps) {
  const { toast } = useToast();
  
  const defaultValues = React.useMemo(() => ({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    currency: initialData?.currency || "ر.س",
    duration: initialData?.duration || "",
    maxGuests: initialData?.maxGuests || 1,
    city: initialData?.city || "",
    categoryRef: initialData?.categoryRef || "",
    address: initialData?.address || "",
    activities: initialData?.activities?.join(", ") || "",
    images: initialData?.images?.join(", ") || "",
    availableDates: initialData?.availableDates?.join(", ") || "",
    availableTimes: initialData?.availableTimes?.join(", ") || "",
    isActive: initialData?.isActive === undefined ? true : initialData.isActive,
  }), [initialData]);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues,
  });
  
  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const processSubmit = (values: ExperienceFormValues) => {
    onSubmitHandler(values);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl rounded-xl border-primary/10">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl font-headline">
          {mode === 'create' ? 'إنشاء تجربة جديدة' : 'تعديل التجربة'}
        </CardTitle>
        <CardDescription className="font-body">
          {mode === 'create' ? 'املأ التفاصيل أدناه لنشر تجربتك.' : 'قم بتحديث تفاصيل تجربتك.'}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(processSubmit)} className="font-body">
          <CardContent className="space-y-6 p-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center"><List className="ml-2 h-4 w-4 text-muted-foreground"/> عنوان التجربة</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: جولة في أسواق جدة التاريخية" {...field} className="text-base h-11 bg-input focus:bg-background" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center"><List className="ml-2 h-4 w-4 text-muted-foreground"/> وصف التجربة</FormLabel>
                  <FormControl>
                    <Textarea placeholder="صف تجربتك بالتفصيل لجذب الضيوف..." {...field} rows={5} className="text-base bg-input focus:bg-background" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-base flex items-center"><DollarSign className="ml-2 h-4 w-4 text-muted-foreground"/> السعر (للشخص)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="مثال: 150" {...field} className="text-base h-11 bg-input focus:bg-background" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-base flex items-center">العملة</FormLabel>
                    <FormControl>
                        <Input placeholder="ر.س" {...field} className="text-base h-11 bg-input focus:bg-background" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-base flex items-center"><ClockIcon className="ml-2 h-4 w-4 text-muted-foreground"/> المدة</FormLabel>
                    <FormControl>
                        <Input placeholder="مثال: 3 ساعات، نصف يوم" {...field} className="text-base h-11 bg-input focus:bg-background" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="maxGuests"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-base flex items-center"><Users className="ml-2 h-4 w-4 text-muted-foreground"/> الحد الأقصى للضيوف</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="مثال: 5" {...field} className="text-base h-11 bg-input focus:bg-background" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-base flex items-center"><MapPinIcon className="ml-2 h-4 w-4 text-muted-foreground"/> المدينة</FormLabel>
                        <Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger className="h-11 text-base bg-input focus:bg-background">
                                <SelectValue placeholder="اختر المدينة" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {cities.map(city => <SelectItem key={city.cityId} value={city.name} className="font-body">{city.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="categoryRef"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-base flex items-center"><TagIcon className="ml-2 h-4 w-4 text-muted-foreground"/> الفئة</FormLabel>
                         <Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger className="h-11 text-base bg-input focus:bg-background">
                                <SelectValue placeholder="اختر الفئة" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {categories.map(cat => <SelectItem key={cat.categoryId} value={cat.categoryId} className="font-body">{cat.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center"><MapPinIcon className="ml-2 h-4 w-4 text-muted-foreground"/> العنوان التفصيلي</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: حي العليا، شارع الأمير محمد بن عبدالعزيز" {...field} className="text-base h-11 bg-input focus:bg-background" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="activities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center"><List className="ml-2 h-4 w-4 text-muted-foreground"/> الأنشطة (افصل بينها بفاصلة)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="مثال: جولة إرشادية, تذوق طعام, ورشة عمل" {...field} rows={3} className="text-base bg-input focus:bg-background" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center"><ImageIcon className="ml-2 h-4 w-4 text-muted-foreground"/> روابط الصور (افصل بينها بفاصلة)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="مثال: https://example.com/image1.png, https://example.com/image2.jpg" {...field} rows={3} className="text-base bg-input focus:bg-background" dir="ltr" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availableDates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center"><CalendarDays className="ml-2 h-4 w-4 text-muted-foreground"/> التواريخ المتاحة (YYYY-MM-DD، افصل بفاصلة)</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: 2024-09-15, 2024-09-20" {...field} className="text-base h-11 bg-input focus:bg-background" dir="ltr" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availableTimes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center"><ClockIcon className="ml-2 h-4 w-4 text-muted-foreground"/> الأوقات المتاحة (افصل بفاصلة)</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: 10:00 AM, 02:00 PM, 05:00 PM" {...field} className="text-base h-11 bg-input focus:bg-background" dir="ltr"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-input/50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center"><CheckSquare className="ml-2 h-4 w-4 text-muted-foreground"/> تفعيل التجربة</FormLabel>
                    <FormDescription className="text-xs">
                      هل ترغب في جعل هذه التجربة متاحة للحجز فوراً؟
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="p-6 border-t">
            <Button type="submit" size="lg" className="w-full sm:w-auto text-base py-3 h-12" disabled={isLoading}>
              {isLoading ? "جاري الحفظ..." : (mode === 'create' ? 'إنشاء التجربة' : 'حفظ التعديلات')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
