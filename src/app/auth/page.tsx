import Link from "next/link";
import { AuthForm } from "@/components/app/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4 selection:bg-primary/20">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
       <div className="relative z-10 flex flex-col items-center mb-8">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-primary mb-4 drop-shadow-lg">
            <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path>
         </svg>
        <h1 className="text-5xl font-headline font-bold text-primary">YallaNro7</h1>
        <p className="text-muted-foreground mt-2 font-body">مرحباً بك! سجل الدخول أو أنشئ حساباً جديداً.</p>
      </div>
      <Card className="w-full max-w-md shadow-2xl z-10 rounded-xl overflow-hidden border-primary/20">
        <CardHeader className="text-center bg-primary/5 p-6">
          {/* Title will be dynamic in AuthForm or passed as prop */}
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <AuthForm />
        </CardContent>
        <CardFooter className="flex flex-col gap-4 p-6 sm:p-8 bg-muted/20">
           <Button variant="outline" className="w-full font-body border-border hover:bg-accent/10 hover:border-accent/50">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.19,4.73 17.5,6.14 18.69,7.17L21.35,4.9C18.36,2.46 15.19,1 12.19,1C5,1 1,7 1,12C1,17.16 5.81,23 12.19,23C18.36,23 22,18.91 22,12.33C22,11.67 21.68,11.1 21.35,11.1V11.1Z" /></svg>
            تسجيل الدخول باستخدام جوجل
          </Button>
           <p className="text-xs text-muted-foreground text-center font-body">
             بالتسجيل، أنت توافق على <Link href="/terms" className="underline hover:text-primary">شروط الخدمة</Link> و 
             <Link href="/privacy" className="underline hover:text-primary">سياسة الخصوصية</Link>.
           </p>
        </CardFooter>
      </Card>
      <Link href="/" className="mt-8 text-sm text-primary hover:underline font-body z-10">
        أو تصفح كضيف
      </Link>
    </div>
  );
}
