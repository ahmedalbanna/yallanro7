
"use client";

import type { Experience, Category, City } from "@/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { DollarSign, List, MapPinIcon, TagIcon, ImageIcon as ImageIconLucide, CalendarDays, ClockIcon, Users, CheckSquare, PlusCircle, XCircle, CalendarIcon as CalendarIconLucide } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { format as formatDate, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";

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
  activities: z.array(z.string().min(1, "وصف النشاط مطلوب.")).min(1, { message: "اذكر نشاطاً واحداً على الأقل." }),
  images: z.array(z.string().min(1, "رابط أو بيانات الصورة مطلوبة.")).min(1, { message: "أضف صورة واحدة على الأقل." }),
  availableDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "التاريخ يجب أن يكون بصيغة YYYY-MM-DD")).min(1, { message: "أضف تاريخاً متاحاً واحداً على الأقل." }),
  availableTimes: z.array(z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "الوقت يجب أن يكون بصيغة HH:MM (24 ساعة)")).min(1, { message: "أضف وقتاً متاحاً واحداً على الأقل." }),
  isActive: z.boolean().default(true),
});

export type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

export function ExperienceForm({ mode, initialData, categories, cities, onSubmitHandler, isLoading }: ExperienceFormProps) {
  
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
    activities: initialData?.activities || [],
    images: initialData?.images || [],
    availableDates: initialData?.availableDates || [],
    availableTimes: initialData?.availableTimes || [],
    isActive: initialData?.isActive === undefined ? true : initialData.isActive,
  }), [initialData]);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues,
  });
  
  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const [currentActivity, setCurrentActivity] = useState("");
  const [currentSelectedDate, setCurrentSelectedDate] = useState<Date | undefined>(undefined);
  const [currentTime, setCurrentTime] = useState("");

  const handleImageFilesChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const currentImages = form.getValues("images");
      const newDataUrls: string[] = [...currentImages];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newDataUrls.push(e.target.result as string);
            // This might cause multiple re-renders, better to batch update if possible
            // For simplicity, updating one by one. If performance issues, collect all promises and set once.
            if (i === files.length -1) { // Update form value after last file is processed
                 form.setValue("images", [...newDataUrls.filter((item, index) => newDataUrls.indexOf(item) === index)], { shouldValidate: true });
            }
          }
        };
        reader.readAsDataURL(file);
      }
       // Reset file input to allow selecting the same file again if removed
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images");
    currentImages.splice(index, 1);
    form.setValue("images", [...currentImages], { shouldValidate: true });
  };

  const addToList = (field: keyof ExperienceFormValues, value: string) => {
    if (!value.trim()) return;
    const currentList = form.getValues(field as any) as string[];
    if (!currentList.includes(value.trim())) {
      form.setValue(field as any, [...currentList, value.trim()], { shouldValidate: true });
    }
  };

  const removeFromList = (field: keyof ExperienceFormValues, index: number) => {
    const currentList = form.getValues(field as any) as string[];
    currentList.splice(index, 1);
    form.setValue(field as any, [...currentList], { shouldValidate: true });
  };

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
          <CardContent className="space-y-8 p-6">
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
            
            {/* Images Field */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center"><ImageIconLucide className="ml-2 h-4 w-4 text-muted-foreground"/> صور التجربة</FormLabel>
                  <FormControl>
                    <>
                      <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()} className="w-full sm:w-auto">
                        <PlusCircle className="ml-2 h-4 w-4" /> إرفاق صور
                      </Button>
                      <input
                        type="file"
                        ref={imageInputRef}
                        multiple
                        accept="image/*"
                        onChange={handleImageFilesChange}
                        className="hidden"
                      />
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {field.value.map((src, index) => (
                          <div key={index} className="relative group aspect-video">
                            <Image src={src} alt={`معاينة الصورة ${index + 1}`} layout="fill" objectFit="cover" className="rounded-md border" data-ai-hint="experience photo"/>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 opacity-75 group-hover:opacity-100"
                              onClick={() => removeImage(index)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </>
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
                        <Select dir="rtl" onValueChange={field.onChange} value={field.value}>
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
                         <Select dir="rtl" onValueChange={field.onChange} value={field.value}>
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
            
            {/* Activities Field */}
            <FormField
              control={form.control}
              name="activities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center"><List className="ml-2 h-4 w-4 text-muted-foreground"/> الأنشطة</FormLabel>
                  <div className="flex gap-2 items-start">
                    <Input 
                      placeholder="اكتب نشاطًا ثم اضغط إضافة" 
                      value={currentActivity} 
                      onChange={(e) => setCurrentActivity(e.target.value)} 
                      className="text-base h-11 bg-input focus:bg-background flex-grow"
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addToList("activities", currentActivity); setCurrentActivity("");}}}
                    />
                    <Button type="button" variant="outline" onClick={() => { addToList("activities", currentActivity); setCurrentActivity("");}} className="h-11">
                        <PlusCircle className="h-4 w-4" /> 
                    </Button>
                  </div>
                  <div className="mt-2 space-x-2 space-x-reverse space-y-2">
                    {field.value.map((activity, index) => (
                      <Badge key={index} variant="secondary" className="py-1 px-3 text-sm">
                        {activity}
                        <XCircle className="mr-1.5 h-4 w-4 cursor-pointer hover:text-destructive" onClick={() => removeFromList("activities", index)} />
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Available Dates Field */}
            <FormField
              control={form.control}
              name="availableDates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center"><CalendarDays className="ml-2 h-4 w-4 text-muted-foreground"/> التواريخ المتاحة</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal h-12 text-base bg-input focus:bg-background ${!currentSelectedDate && "text-muted-foreground"}`}
                        >
                          <CalendarIconLucide className="ml-2 h-4 w-4" />
                          {currentSelectedDate ? formatDate(currentSelectedDate, "PPP", { locale: arSA }) : <span>اختر تاريخاً لإضافته</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={currentSelectedDate}
                          onSelect={setCurrentSelectedDate}
                          initialFocus
                          locale={arSA}
                        />
                      </PopoverContent>
                    </Popover>
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                            if (currentSelectedDate) {
                                addToList("availableDates", formatDate(currentSelectedDate, "yyyy-MM-dd"));
                                setCurrentSelectedDate(undefined);
                            }
                        }} 
                        className="mt-2 w-full sm:w-auto"
                        disabled={!currentSelectedDate}
                    >
                        <PlusCircle className="ml-2 h-4 w-4" /> إضافة التاريخ المحدد
                    </Button>
                  <div className="mt-2 space-x-2 space-x-reverse space-y-2">
                    {field.value.map((dateStr, index) => (
                      <Badge key={index} variant="secondary" className="py-1 px-3 text-sm">
                        {formatDate(parseISO(dateStr), "PPP", { locale: arSA })}
                        <XCircle className="mr-1.5 h-4 w-4 cursor-pointer hover:text-destructive" onClick={() => removeFromList("availableDates", index)} />
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Available Times Field */}
            <FormField
              control={form.control}
              name="availableTimes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base flex items-center"><ClockIcon className="ml-2 h-4 w-4 text-muted-foreground"/> الأوقات المتاحة (صيغة 24 ساعة)</FormLabel>
                  <div className="flex gap-2 items-start">
                    <Input 
                      type="time"
                      value={currentTime} 
                      onChange={(e) => setCurrentTime(e.target.value)} 
                      className="text-base h-11 bg-input focus:bg-background flex-grow"
                    />
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => { addToList("availableTimes", currentTime); setCurrentTime("");}} 
                        className="h-11"
                        disabled={!currentTime}
                    >
                        <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 space-x-2 space-x-reverse space-y-2">
                    {field.value.map((time, index) => (
                      <Badge key={index} variant="secondary" className="py-1 px-3 text-sm">
                        {time} {/* Display as HH:mm */}
                        <XCircle className="mr-1.5 h-4 w-4 cursor-pointer hover:text-destructive" onClick={() => removeFromList("availableTimes", index)} />
                      </Badge>
                    ))}
                  </div>
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

    