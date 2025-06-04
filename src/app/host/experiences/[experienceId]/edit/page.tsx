
"use client";
import { AppHeader } from "@/components/app/app-header";
import { ExperienceForm, type ExperienceFormValues } from "@/components/app/experience-form";
import type { Experience } from "@/models";
import { mockCategories, mockCities } from "@/app/page"; 
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React, { use } from "react";

// Mock data fetching - replace with actual data fetching based on params.experienceId
const mockExperienceToEdit: Experience = {
  experienceId: 'exp1',
  title: 'رحلة سفاري صحراوية مثيرة مع عشاء تقليدي',
  description: 'انطلق في مغامرة لا تُنسى عبر كثبان الذهب الرملية الساحرة، واستمتع بتجربة قيادة سيارات الدفع الرباعي المثيرة بين التضاريس المتنوعة. شاهد غروب الشمس الخلاب وهو يلون السماء بألوان دافئة، واختتم يومك بعشاء تقليدي فاخر تحت النجوم المتلألئة.',
  activities: ['قيادة سيارات الدفع الرباعي', 'ركوب الجمال', 'عشاء تقليدي فاخر'],
  images: ['https://placehold.co/600x400.png?text=Safari1&font=belleza', 'https://placehold.co/600x400.png?text=Safari2&font=belleza'],
  price: 350,
  currency: 'ر.س',
  duration: '6 ساعات',
  maxGuests: 10,
  location: { lat: 24.774265, lng: 46.738586 },
  address: 'مخيم صحراوي فاخر، بالقرب من الرياض',
  city: 'الرياض', 
  categoryRef: 'cat1', 
  hostRef: 'host1',
  availableDates: ['2024-09-15', '2024-09-20', '2024-09-25'],
  availableTimes: ['15:00', '17:00'], // HH:mm format
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

interface PageResolvedParams {
  experienceId: string;
}

interface EditExperiencePageProps {
  params: Promise<PageResolvedParams>;
}

export default function EditExperiencePage({ params: paramsPromise }: EditExperiencePageProps) {
  const resolvedParams = use(paramsPromise);
  const { experienceId } = resolvedParams;
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  // In a real app, fetch experience data by experienceId here
  const experienceToEdit: Partial<Experience> = {
    ...mockExperienceToEdit, // Use the updated mock data with arrays
    experienceId,
  };


  const handleSubmit = async (data: ExperienceFormValues) => {
    setIsLoading(true);
    console.log(`Updating experience ${experienceId} with data:`, data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Data is already in the correct array format from ExperienceForm
    console.log("Parsed experience data for API (update):", data);
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

    