
"use client";

import { AppHeader } from "@/components/app/app-header";
import { ExperienceForm, type ExperienceFormValues } from "@/components/app/experience-form";
import { mockCategories, mockCities } from "@/app/page"; 
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; 
import React from "react";

export default function CreateExperiencePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: ExperienceFormValues) => {
    setIsLoading(true);
    console.log("Creating experience with data:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Data is already in the correct array format from ExperienceForm
    console.log("Experience data for API:", data);
    // TODO: Call actual API to save the experience

    setIsLoading(false);
    toast({
      title: "نجاح!",
      description: `تم إنشاء التجربة "${data.title}" بنجاح.`,
    });
    router.push("/host/listings"); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto py-8 sm:py-12 px-4">
         <ExperienceForm 
            mode="create"
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

    