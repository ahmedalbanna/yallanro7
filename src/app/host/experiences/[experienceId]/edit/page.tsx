
"use client";
import { AppHeader } from "@/components/app/app-header";
import { ExperienceForm, type ExperienceFormValues } from "@/components/app/experience-form";
import type { Experience } from "@/models";
import { mockCategories, mockCities } from "@/app/page"; // This is not ideal
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React from "react";

// Mock data fetching - replace with actual data fetching based on params.experienceId
const mockExperience: Experience = {
  experienceId: 'exp1',
  title: 'رحلة سفاري صحراوية مثيرة مع عشاء تقليدي',
  description: 'انطلق في مغامرة لا تُنسى عبر كثبان الذهب الرملية الساحرة، واستمتع بتجربة قيادة سيارات الدفع الرباعي المثيرة بين التضاريس المتنوعة. شاهد غروب الشمس الخلاب وهو يلون السماء بألوان دافئة، واختتم يومك بعشاء تقليدي فاخر تحت النجوم المتلألئة.',
  activities: ['قيادة سيارات الدفع الرباعي', 'ركوب الجمال', 'عشاء تقليدي فاخر'],
  images: ['https://placehold.co/600x400.png?text=Safari1', 'https://placehold.co/600x400.png?text=Safari2'],
  price: 350,
  currency: 'ر.س',
  duration: '6 ساعات',
  maxGuests: 10,
  location: { lat: 24.774265, lng: 46.738586 },
  address: 'مخيم صحراوي فاخر، بالقرب من الرياض',
  city: 'الرياض', // Should match a name in mockCities for Select to pre-select
  categoryRef: 'cat1', // Should match a categoryId in mockCategories
  hostRef: 'host1',
  availableDates: ['2024-09-15', '2024-09-20', '2024-09-25'],
  availableTimes: ['03:00 PM', '05:00 PM'],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

interface EditExperiencePageProps {
  params: { experienceId: string };
}

export default function EditExperiencePage({ params }: EditExperiencePageProps) {
  const { experienceId } = params;
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  // In a real app, fetch experience data by experienceId here
  // For now, using mockExperience and adding the ID from params
  const experienceToEdit: Partial<Experience> = { 
    ...mockExperience, 
    experienceId,
    // Ensure city and categoryRef match values used by Select components if they are names/IDs
    city: mockExperience.city, // Assuming mockExperience.city is the value (name) used in Select
    categoryRef: mockExperience.categoryRef, // Assuming mockExperience.categoryRef is the value (ID)
  }; 


  const handleSubmit = async (data: ExperienceFormValues) => {
    setIsLoading(true);
    console.log(`Updating experience ${experienceId} with data:`, data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const experienceData = {
        ...data,
        activities: data.activities.split(',').map(s => s.trim()).filter(s => s),
        images: data.images.split(',').map(s => s.trim()).filter(s => s),
        availableDates: data.availableDates.split(',').map(s => s.trim()).filter(s => s),
        availableTimes: data.availableTimes.split(',').map(s => s.trim()).filter(s => s),
    };
    console.log("Parsed experience data for API (update):", experienceData);
    // TODO: Call actual API to update the experience

    setIsLoading(false);
    toast({
      title: "نجاح!",
      description: `تم تحديث التجربة "${data.title}" بنجاح.`,
    });
    router.push("/host/listings");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto py-8 sm:py-12 px-4">
        <ExperienceForm 
            mode="edit"
            initialData={experienceToEdit}
            categories={mockCategories}
            cities={mockCities}
            onSubmitHandler={handleSubmit}
            isLoading={isLoading}
        />
      </main>
      <footer className="py-8 border-t bg-card mt-12">
        <div className="container text-center text-sm text-muted-foreground font-body">
          © {new Date().getFullYear()} YallaNro7. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
