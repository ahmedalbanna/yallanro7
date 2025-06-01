import { AppHeader } from "@/components/app/app-header";
import { PlaceholderContent } from "@/components/app/placeholder-content";
import { Construction } from "lucide-react";

export default function CreateExperiencePage() {
  // In a real app, you'd have a form component here
  // For now, using PlaceholderContent

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-headline text-primary">إنشاء تجربة جديدة</h1>
          <p className="text-muted-foreground font-body mt-2">شارك شغفك وقدم تجربة لا تُنسى لضيوفك.</p>
        </div>
        
        <PlaceholderContent 
          title="نموذج إنشاء/تعديل التجربة" 
          message="هنا سيتمكن المضيفون من إدخال جميع تفاصيل التجربة، بما في ذلك الصور، الوصف، الأسعار، التواريخ المتاحة، والموقع."
          icon={Construction}
        />
        
        {/* Example structure for when form is built:
        <Card className="max-w-3xl mx-auto shadow-xl rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">تفاصيل التجربة</CardTitle>
          </CardHeader>
          <CardContent>
            // <ExperienceForm mode="create" />
          </CardContent>
        </Card>
        */}
      </main>
      <footer className="py-8 border-t bg-card mt-12">
        <div className="container text-center text-sm text-muted-foreground font-body">
          © {new Date().getFullYear()} YallaNro7. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
