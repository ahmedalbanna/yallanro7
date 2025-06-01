"use client";

import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2, Tag, MapPin, Image as ImageIcon } from "lucide-react";
import type { Category, City } from "@/models";
import React, { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

const mockCategoriesData: Category[] = [
  { categoryId: 'cat1', name: 'مغامرات', iconUrl: 'Activity' },
  { categoryId: 'cat2', name: 'طبخ', iconUrl: 'CookingPot' },
  { categoryId: 'cat3', name: 'فنون وثقافة', iconUrl: 'Paintbrush' },
  { categoryId: 'cat4', name: 'رحلات بحرية', iconUrl: 'Anchor' }, // Anchor is not in lucide, placeholder
];

const mockCitiesData: City[] = [
  { cityId: 'city1', name: 'الرياض' },
  { cityId: 'city2', name: 'جدة' },
  { cityId: 'city3', name: 'الدمام' },
  { cityId: 'city4', name: 'مكة المكرمة' },
];

type FormDataType = Partial<Category & City> & { type: 'category' | 'city'; mode: 'add' | 'edit' };

export default function ManageCategoriesCitiesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategoriesData);
  const [cities, setCities] = useState<City[]>(mockCitiesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<FormDataType | null>(null);
  const [currentEntityName, setCurrentEntityName] = useState("");
  const [currentEntityIcon, setCurrentEntityIcon] = useState("");


  const { toast } = useToast();

  const filteredCategories = useMemo(() =>
    categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase())),
  [categories, searchTerm]);

  const filteredCities = useMemo(() =>
    cities.filter(city => city.name.toLowerCase().includes(searchTerm.toLowerCase())),
  [cities, searchTerm]);

  const openForm = (type: 'category' | 'city', mode: 'add' | 'edit', entity?: Category | City) => {
    setFormData({
      type,
      mode,
      ...(entity || {})
    });
    setCurrentEntityName(entity?.name || "");
    if(type === 'category' && (entity as Category)?.iconUrl) {
        setCurrentEntityIcon((entity as Category).iconUrl || "");
    } else {
        setCurrentEntityIcon("");
    }
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const entityId = formData.categoryId || formData.cityId || `new-${Date.now()}`;
    const entityName = currentEntityName.trim();
    if(!entityName) {
        toast({ title: "خطأ", description: "اسم الكيان مطلوب.", variant: "destructive" });
        return;
    }

    if (formData.type === 'category') {
      const newCategory: Category = { categoryId: entityId, name: entityName, iconUrl: currentEntityIcon };
      if (formData.mode === 'add') {
        setCategories(prev => [...prev, newCategory]);
        toast({ title: "نجاح", description: `تمت إضافة الفئة "${entityName}".` });
      } else {
        setCategories(prev => prev.map(c => c.categoryId === entityId ? newCategory : c));
        toast({ title: "نجاح", description: `تم تعديل الفئة "${entityName}".` });
      }
    } else { // city
      const newCity: City = { cityId: entityId, name: entityName };
      if (formData.mode === 'add') {
        setCities(prev => [...prev, newCity]);
        toast({ title: "نجاح", description: `تمت إضافة المدينة "${entityName}".` });
      } else {
        setCities(prev => prev.map(c => c.cityId === entityId ? newCity : c));
        toast({ title: "نجاح", description: `تم تعديل المدينة "${entityName}".` });
      }
    }
    setIsFormOpen(false);
    setFormData(null);
  };

  const handleDelete = (type: 'category' | 'city', id: string, name: string) => {
     // Add confirmation dialog here in real app
    if (type === 'category') {
      setCategories(prev => prev.filter(c => c.categoryId !== id));
    } else {
      setCities(prev => prev.filter(c => c.cityId !== id));
    }
    toast({ title: "تم الحذف", description: `تم حذف ${type === 'category' ? 'الفئة' : 'المدينة'} "${name}".` });
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-headline text-primary">إدارة الفئات والمدن</h1>
        </div>

        <Tabs defaultValue="categories" className="w-full font-body" dir="rtl">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-auto bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="categories" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md flex items-center justify-center gap-2"><Tag className="h-5 w-5"/>الفئات</TabsTrigger>
            <TabsTrigger value="cities" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md flex items-center justify-center gap-2"><MapPin className="h-5 w-5"/>المدن</TabsTrigger>
          </TabsList>

          <div className="mb-6 p-4 bg-card rounded-xl shadow-md">
            <Input
                type="text"
                placeholder="بحث..."
                className="h-11 text-base bg-input focus:bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <TabsContent value="categories">
            <div className="flex justify-end mb-4">
              <Button onClick={() => openForm('category', 'add')} className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" /> إضافة فئة جديدة
              </Button>
            </div>
            <div className="bg-card rounded-xl shadow-md overflow-hidden">
              <Table>
                <TableHeader><TableRow className="bg-muted/50"><TableHead className="font-body">اسم الفئة</TableHead><TableHead className="font-body hidden sm:table-cell">أيقونة (اسم)</TableHead><TableHead className="text-left font-body">الإجراءات</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredCategories.map(cat => (
                    <TableRow key={cat.categoryId} className="hover:bg-muted/30">
                      <TableCell className="font-medium py-3 pr-3">{cat.name}</TableCell>
                      <TableCell className="text-muted-foreground hidden sm:table-cell py-3">{cat.iconUrl || '-'}</TableCell>
                      <TableCell className="text-left py-3">
                        <Button variant="ghost" size="icon" onClick={() => openForm('category', 'edit', cat)} className="text-blue-500 hover:text-blue-700 h-8 w-8"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete('category', cat.categoryId, cat.name)} className="text-destructive hover:text-destructive/80 h-8 w-8 mr-1"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                   {filteredCategories.length === 0 && <TableRow><TableCell colSpan={3} className="text-center h-24 text-muted-foreground">لا توجد فئات تطابق البحث.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="cities">
             <div className="flex justify-end mb-4">
              <Button onClick={() => openForm('city', 'add')} className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" /> إضافة مدينة جديدة
              </Button>
            </div>
             <div className="bg-card rounded-xl shadow-md overflow-hidden">
              <Table>
                 <TableHeader><TableRow className="bg-muted/50"><TableHead className="font-body">اسم المدينة</TableHead><TableHead className="text-left font-body">الإجراءات</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredCities.map(city => (
                    <TableRow key={city.cityId} className="hover:bg-muted/30">
                      <TableCell className="font-medium py-3 pr-3">{city.name}</TableCell>
                      <TableCell className="text-left py-3">
                        <Button variant="ghost" size="icon" onClick={() => openForm('city', 'edit', city)} className="text-blue-500 hover:text-blue-700 h-8 w-8"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete('city', city.cityId, city.name)} className="text-destructive hover:text-destructive/80 h-8 w-8 mr-1"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                   {filteredCities.length === 0 && <TableRow><TableCell colSpan={2} className="text-center h-24 text-muted-foreground">لا توجد مدن تطابق البحث.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add/Edit Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen} dir="rtl">
          <DialogContent className="sm:max-w-[425px] font-body">
            <form onSubmit={handleFormSubmit}>
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl">
                  {formData?.mode === 'add' ? 'إضافة' : 'تعديل'} {formData?.type === 'category' ? 'فئة' : 'مدينة'}
                </DialogTitle>
                <DialogDescription>
                  {formData?.mode === 'add' ? 'أدخل تفاصيل الكيان الجديد.' : `قم بتعديل تفاصيل ${formData?.type === 'category' ? 'الفئة' : 'المدينة'}.`}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-6">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="entity-name" className="text-right col-span-1">الاسم</Label>
                  <Input id="entity-name" value={currentEntityName} onChange={(e) => setCurrentEntityName(e.target.value)} className="col-span-3 h-11 bg-input focus:bg-background" required />
                </div>
                {formData?.type === 'category' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category-icon" className="text-right col-span-1">
                        <ImageIcon className="inline-block ml-1 h-4 w-4 text-muted-foreground"/>
                        الأيقونة
                    </Label>
                    <Input id="category-icon" value={currentEntityIcon} onChange={(e) => setCurrentEntityIcon(e.target.value)} placeholder="اسم أيقونة Lucide (مثل: Activity)" className="col-span-3 h-11 bg-input focus:bg-background" />
                  </div>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
                <Button type="submit">{formData?.mode === 'add' ? 'إضافة' : 'حفظ التعديلات'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </main>
      <footer className="py-8 border-t bg-card mt-12">
        <div className="container text-center text-sm text-muted-foreground font-body">
          © {new Date().getFullYear()} YallaNro7. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
