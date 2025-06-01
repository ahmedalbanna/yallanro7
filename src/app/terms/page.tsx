import { AppHeader } from "@/components/app/app-header";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto py-12 px-4">
        <article className="prose prose-lg max-w-4xl mx-auto font-body text-foreground prose-headings:font-headline prose-headings:text-primary prose-h1:text-4xl prose-h2:text-2xl prose-a:text-accent hover:prose-a:text-accent/80">
          <h1>شروط الخدمة</h1>
          <p>مرحبًا بك في YallaNro7!</p>
          <p>
            تنطبق هذه الشروط والأحكام ("الشروط") على استخدامك لمنصة YallaNro7 ("المنصة") وجميع الخدمات ذات الصلة التي نقدمها. باستخدام المنصة، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على هذه الشروط، فلا يجوز لك استخدام المنصة.
          </p>

          <h2>1. استخدام المنصة</h2>
          <p>
            يجب أن تكون على الأقل 18 عامًا لاستخدام المنصة. أنت مسؤول عن أي نشاط يحدث تحت حسابك. يجب عليك الحفاظ على أمان كلمة المرور الخاصة بك.
          </p>

          <h2>2. حجوزات التجارب</h2>
          <p>
            توفر المنصة سوقًا للعملاء ("العملاء") لحجز تجارب فريدة ("التجارب") يقدمها مضيفون مستقلون ("المضيفون"). YallaNro7 ليست طرفًا في أي اتفاقيات يتم إبرامها بين العملاء والمضيفين.
          </p>
          <p>
            يلتزم المضيفون بتقديم معلومات دقيقة حول تجاربهم. يلتزم العملاء بدفع جميع الرسوم المطبقة عند الحجز.
          </p>

          <h2>3. الإلغاء واسترداد الأموال</h2>
          <p>
            تخضع سياسات الإلغاء واسترداد الأموال للشروط المحددة من قبل كل مضيف لكل تجربة. يرجى مراجعة سياسة الإلغاء الخاصة بالتجربة قبل الحجز.
          </p>

          <h2>4. المحتوى والسلوك</h2>
          <p>
            أنت وحدك المسؤول عن أي محتوى تقوم بنشره أو تحميله على المنصة. يجب ألا تنشر أي محتوى غير قانوني أو تشهيري أو ينتهك حقوق الآخرين.
          </p>

          <h2>5. تعديل الشروط</h2>
          <p>
            نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة. استمرار استخدامك للمنصة بعد نشر التغييرات يشكل موافقتك على الشروط المعدلة.
          </p>

          <h2>6. الاتصال بنا</h2>
          <p>
            إذا كان لديك أي أسئلة حول هذه الشروط، يرجى الاتصال بنا على support@yallanro7.example.com.
          </p>
          <p>آخر تحديث: {new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </article>
      </main>
      <footer className="py-8 border-t bg-card mt-12">
        <div className="container text-center text-sm text-muted-foreground font-body">
          © {new Date().getFullYear()} YallaNro7. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
