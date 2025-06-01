import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface PlaceholderContentProps {
  title: string;
  message?: string;
  icon?: React.ElementType;
}

export function PlaceholderContent({ title, message, icon: Icon = Construction }: PlaceholderContentProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-8">
      <Card className="max-w-md w-full shadow-xl rounded-xl border-primary/10">
        <CardHeader className="p-8">
          <Icon className="h-16 w-16 text-primary mx-auto mb-6" />
          <CardTitle className="text-3xl font-headline text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pb-8">
          <p className="text-lg text-muted-foreground font-body">
            {message || "هذه الصفحة قيد الإنشاء حالياً. ترقبوا التحديثات قريباً!"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
