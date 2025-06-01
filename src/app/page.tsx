
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AppHeader } from "@/components/app/app-header";
import { ExperienceCard } from "@/components/app/experience-card";
import { CategoryChip } from "@/components/app/category-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search } from "lucide-react";
import type { Experience, Category, City } from "@/models"; 

// Category and City mocks can stay as they are.
export const mockCategories: Category[] = [
  { categoryId: 'cat1', name: 'مغامرات', iconUrl: 'Activity' },
  { categoryId: 'cat2', name: 'طبخ', iconUrl: 'CookingPot' },
  { categoryId: 'cat3', name: 'فنون', iconUrl: 'Paintbrush' },
  { categoryId: 'cat4', name: 'تاريخ', iconUrl: 'Scroll' },
  { categoryId: 'cat5', name: 'طبيعة', iconUrl: 'Mountain' },
];

export const mockCities: City[] = [
  { cityId: 'city1', name: 'الرياض' },
  { cityId: 'city2', name: 'جدة' },
  { cityId: 'city3', name: 'الدمام' },
  { cityId: 'city4', name: 'مكة المكرمة' },
  { cityId: 'city5', name: 'المدينة المنورة' },
];


export default function HomePage() {
  const [displayedExperiences, setDisplayedExperiences] = useState<Experience[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all"); // 'all' or city name
  const [selectedCategory, setSelectedCategory] = useState("all"); // 'all' or categoryId

  useEffect(() => {
    // Generate experiences with random values on the client side after mount
    const generatedExperiences = Array(8).fill(null).map((_, i) => {
      const now = new Date(); // Consistent for this batch
      return {
        experienceId: `exp${i + 1}`,
        title: `تجربة مذهلة في ${i % 2 === 0 ? 'الرياض' : 'جدة'} رقم ${i + 1}`,
        description: 'وصف قصير ومثير لهذه التجربة الفريدة من نوعها التي تستكشف معالم المدينة وتقدم أنشطة متنوعة.',
        activities: ['نشاط رئيسي', 'جولة استكشافية', 'تذوق أطعمة محلية'],
        images: [`https://placehold.co/600x400.png?text=Exp+${i + 1}&font=belleza`, `https://placehold.co/600x400.png?text=Image+${i+1}B&font=belleza` ],
        price: Math.floor(Math.random() * 200) + 100,
        currency: 'ر.س',
        duration: `${Math.floor(Math.random() * 3) + 2} ساعات`,
        maxGuests: Math.floor(Math.random() * 6) + 2,
        location: { lat: 24.7136 + (Math.random()-0.5)*2, lng: 46.6753 + (Math.random()-0.5)*2 }, 
        address: `عنوان افتراضي ${i + 1}, ${i % 2 === 0 ? 'الرياض' : 'جدة'}`,
        city: i % 2 === 0 ? 'الرياض' : 'جدة',
        categoryRef: `cat${(i % 3) + 1}`, 
        hostRef: `host${i + 1}`,
        availableDates: [],
        availableTimes: [],
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };
    });
    setDisplayedExperiences(generatedExperiences);
  }, []); // Empty dependency array, runs once on mount

  const filteredExperiences = useMemo(() => {
    return displayedExperiences.filter(exp => {
      const matchesSearch = searchTerm === "" || exp.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === "all" || exp.city === selectedCity;
      const matchesCategory = selectedCategory === "all" || exp.categoryRef === selectedCategory;
      return matchesSearch && matchesCity && matchesCategory;
    });
  }, [searchTerm, selectedCity, selectedCategory, displayedExperiences]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  const handleSearchButtonClick = () => {
    console.log("Search button clicked with: ", { searchTerm, selectedCity, selectedCategory });
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-background text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container relative z-10">
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6 text-primary animate-fade-in-down">
              اكتشف تجارب لا تُنسى مع يلا نروح!
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-8 font-body animate-fade-in-up">
              انطلق في مغامرات فريدة، تعلم مهارات جديدة، أو استمتع بلحظات لا تُنسى مع مجموعتنا المختارة من التجارب الأصيلة في جميع أنحاء المملكة.
            </p>
            <Button size="lg" className="text-lg px-8 py-6 font-body animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              استكشف الآن
            </Button>
          </div>
        </section>
        
        <div className="container mx-auto py-8 px-4">
          {/* Search and Filters Bar */}
          <div className="mb-10 p-4 sm:p-6 bg-card rounded-xl shadow-lg sticky top-[calc(4rem+1px)] z-40 backdrop-blur-sm bg-card/90"> {/* 4rem is h-16 of header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
              <div className="lg:col-span-1">
                <label htmlFor="search-experience" className="block text-sm font-medium text-foreground/90 mb-1 font-body">
                  ما الذي تبحث عنه؟
                </label>
                <div className="relative">
                  <Input
                    id="search-experience"
                    type="text"
                    placeholder="مثال: رحلة سفاري، دورة طبخ..."
                    className="h-11 pl-10 text-base bg-input focus:bg-background"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div>
                <label htmlFor="city-select" className="block text-sm font-medium text-foreground/90 mb-1 font-body">
                  اختر المدينة
                </label>
                <Select dir="rtl" value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger id="city-select" className="h-11 text-base bg-input focus:bg-background">
                    <MapPin className="ml-2 h-5 w-5 text-muted-foreground" />
                    <SelectValue placeholder="جميع المدن" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المدن</SelectItem>
                    {mockCities.map((city) => (
                      <SelectItem key={city.cityId} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full h-11 text-base sm:col-span-2 lg:col-span-1" onClick={handleSearchButtonClick}>
                <Search className="ml-2 h-5 w-5" />
                بحث
              </Button>
            </div>
          </div>

          {/* Categories Chips */}
          <section className="mb-10">
            <h2 className="text-2xl font-headline font-semibold mb-4 text-foreground">تصفح حسب الفئة</h2>
            <div className="flex space-x-2 space-x-reverse overflow-x-auto pb-3 -mx-4 px-4">
              <CategoryChip 
                category={{ categoryId: 'all', name: 'عرض الكل'}} 
                isSelected={selectedCategory === 'all'} 
                onClick={() => handleCategoryClick('all')} 
              />
              {mockCategories.map((category) => (
                <CategoryChip 
                  key={category.categoryId} 
                  category={category} 
                  isSelected={selectedCategory === category.categoryId}
                  onClick={() => handleCategoryClick(category.categoryId)} 
                />
              ))}
            </div>
          </section>

          {/* Experiences Grid */}
          <section>
            <h2 className="text-3xl font-headline font-semibold mb-8 text-foreground">
              {searchTerm || selectedCity !== 'all' || selectedCategory !== 'all' ? `نتائج البحث عن "${searchTerm}"` : "تجارب مقترحة لك"}
            </h2>
            {filteredExperiences.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
                {filteredExperiences.map((exp) => (
                  <ExperienceCard key={exp.experienceId} experience={exp} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-10 text-lg font-body">
                {displayedExperiences.length === 0 ? "جاري تحميل التجارب..." : "لا توجد تجارب تطابق معايير البحث الحالية. حاول تعديل بحثك."}
              </p>
            )}
          </section>
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
