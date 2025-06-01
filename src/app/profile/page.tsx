import { AppHeader } from "@/components/app/app-header";
import { ProfileForm } from "@/components/app/profile-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck, LogOut, KeyRound } from "lucide-react";

// Mock user data, in a real app this would come from auth context/backend
const mockUser = {
  uid: 'user123',
  email: 'user@example.com',
  displayName: 'خالد الأحمد',
  photoUrl: 'https://placehold.co/128x128.png?font=belleza&text=KA',
  role: 'client' as 'client' | 'host' | 'admin',
  phoneNumber: '0501234567',
  bio: 'مستكشف وعاشق للمغامرات، أحب تجربة كل ما هو جديد ومثير في عالم السفر والاستكشافات!',
};

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto py-8 sm:py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-xl rounded-xl overflow-hidden border-primary/10">
            <CardHeader className="bg-gradient-to-br from-primary/10 via-background to-accent/5 p-6 sm:p-8 text-center">
              <div className="flex flex-col items-center">
                <Avatar className="w-28 h-28 sm:w-32 sm:h-32 mb-4 border-4 border-background shadow-lg">
                  <AvatarImage src={mockUser.photoUrl} alt={mockUser.displayName} />
                  <AvatarFallback className="text-4xl font-headline">{mockUser.displayName.slice(0,2)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-3xl sm:text-4xl font-headline mb-1">{mockUser.displayName}</CardTitle>
                <CardDescription className="text-base sm:text-lg font-body text-foreground/80">{mockUser.email}</CardDescription>
                <span className="mt-3 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary font-body ring-1 ring-primary/20">
                  <ShieldCheck className="ml-1.5 h-4 w-4" />
                  {mockUser.role === 'client' && 'عميل'}
                  {mockUser.role === 'host' && 'مضيف'}
                  {mockUser.role === 'admin' && 'مسؤول'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-2xl font-headline mb-6 text-center text-primary">تعديل معلومات الملف الشخصي</h2>
              <ProfileForm user={mockUser} />
            </CardContent>
            <CardFooter className="p-6 sm:p-8 border-t bg-muted/20 flex flex-col sm:flex-row justify-between items-center gap-4">
              <Button variant="outline" className="w-full sm:w-auto font-body text-base h-11 border-border hover:bg-accent/10 hover:border-accent/50">
                <KeyRound className="ml-2 h-4 w-4" />
                تغيير كلمة المرور
              </Button>
              <Button variant="destructive" className="w-full sm:w-auto font-body text-base h-11">
                <LogOut className="ml-2 h-4 w-4" />
                تسجيل الخروج
              </Button>
            </CardFooter>
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
