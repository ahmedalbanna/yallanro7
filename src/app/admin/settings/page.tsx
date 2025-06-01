
import { AppHeader } from "@/components/app/app-header";
import { PlaceholderContent } from "@/components/app/placeholder-content";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-headline text-primary">إعدادات المنصة</h1>
          <p className="text-lg text-muted-foreground font-body mt-2">
            تكوين الإعدادات العامة لمنصة YallaNro7.
          </p>
        </div>

        <PlaceholderContent
          title="تكوين الإعدادات"
          message="سيتم هنا عرض خيارات لتكوين جوانب مختلفة من المنصة مثل تفاصيل الاتصال، تكامل وسائل التواصل الاجتماعي، وإعدادات الإشعارات."
          icon={Settings}
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
