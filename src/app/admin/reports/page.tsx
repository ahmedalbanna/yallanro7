
"use client";

import { StatsCard } from "@/components/app/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, LineChart, PieChart, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { DollarSign, BookOpen, Users, Star, TrendingUp, TrendingDown, Activity, Percent, MapPin } from "lucide-react";
import React from "react";

const mockTotalRevenue = 125500;
const mockBookingsThisMonth = 180;
const mockNewUsersThisMonth = 75;
const mockAvgExperienceRating = 4.7;

const userGrowthData = [
  { month: "يناير", users: 65 },
  { month: "فبراير", users: 90 },
  { month: "مارس", users: 140 },
  { month: "أبريل", users: 190 },
  { month: "مايو", users: 250 },
  { month: "يونيو", users: 310 },
];

const bookingCategoryData = [
  { category: "مغامرات", bookings: 450, fill: "hsl(var(--chart-1))" },
  { category: "طبخ", bookings: 280, fill: "hsl(var(--chart-2))" },
  { category: "فنون وثقافة", bookings: 320, fill: "hsl(var(--chart-3))" },
  { category: "رحلات بحرية", bookings: 180, fill: "hsl(var(--chart-4))" },
  { category: "تاريخ وآثار", bookings: 210, fill: "hsl(var(--chart-5))" },
];

const monthlyRevenueData = [
  { month: "يناير", revenue: 15000 },
  { month: "فبراير", revenue: 18000 },
  { month: "مارس", revenue: 22000 },
  { month: "أبريل", revenue: 25000 },
  { month: "مايو", revenue: 30000 },
  { month: "يونيو", revenue: 35000 },
];

const bookingStatusData = [
    { status: "مؤكدة", count: 750, fill: "hsl(var(--chart-1))"},
    { status: "مكتملة", count: 1800, fill: "hsl(var(--chart-2))"},
    { status: "ملغاة", count: 250, fill: "hsl(var(--chart-3))"},
];

const userCityData = [
    { city: "الرياض", users: 400, fill: "hsl(var(--chart-1))"},
    { city: "جدة", users: 350, fill: "hsl(var(--chart-2))"},
    { city: "الدمام", users: 150, fill: "hsl(var(--chart-3))"},
    { city: "مكة", users: 80, fill: "hsl(var(--chart-4))"},
    { city: "أخرى", users: 50, fill: "hsl(var(--chart-5))"},
];

const topExperiencesData = [
  { id: "exp1", title: "رحلة غوص استكشافية في البحر الأحمر", bookings: 120, revenue: 54000 },
  { id: "exp2", title: "جولة تذوق القهوة السعودية المختصة", bookings: 95, revenue: 14250 },
  { id: "exp3", title: "ورشة صناعة العطور التقليدية", bookings: 80, revenue: 22400 },
  { id: "exp4", title: "مغامرة تسلق جبال طويق", bookings: 70, revenue: 28000 },
  { id: "exp5", title: "دورة الطهي النجدي الأصيل", bookings: 65, revenue: 16250 },
];

const chartConfig = {
  users: { label: "المستخدمون", color: "hsl(var(--chart-1))" },
  bookings: { label: "الحجوزات", color: "hsl(var(--chart-2))" },
  revenue: { label: "الإيرادات (ر.س)", color: "hsl(var(--chart-3))" },
};

export default function AdminReportsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-headline text-primary">التقارير والإحصائيات</h1>
          <p className="text-lg text-muted-foreground font-body mt-2">نظرة شاملة على أداء المنصة ومؤشراتها الرئيسية.</p>
        </div>

        {/* Key Metrics Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="إجمالي الإيرادات"
            value={`${mockTotalRevenue.toLocaleString('ar-SA')} ر.س`}
            icon={DollarSign}
            description={<span className="text-green-500 flex items-center"><TrendingUp className="h-4 w-4 ml-1"/> +12% عن الشهر الماضي</span>}
            colorClass="text-green-500"
          />
          <StatsCard
            title="الحجوزات هذا الشهر"
            value={mockBookingsThisMonth.toLocaleString('ar-SA')}
            icon={BookOpen}
            description={<span className="text-blue-500 flex items-center"><TrendingUp className="h-4 w-4 ml-1"/> +8% عن الشهر الماضي</span>}
            colorClass="text-blue-500"
          />
          <StatsCard
            title="المستخدمون الجدد (الشهر)"
            value={mockNewUsersThisMonth.toLocaleString('ar-SA')}
            icon={Users}
            description={<span className="text-purple-500 flex items-center"><TrendingUp className="h-4 w-4 ml-1"/> +15% عن الشهر الماضي</span>}
            colorClass="text-purple-500"
          />
          <StatsCard
            title="متوسط تقييم التجارب"
            value={mockAvgExperienceRating.toString()}
            icon={Star}
            description="بناءً على 500+ تقييم"
            colorClass="text-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Revenue Analysis */}
          <Card className="shadow-lg rounded-xl border-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center"><DollarSign className="ml-2 h-6 w-6 text-primary"/>تحليل الإيرادات</CardTitle>
              <CardDescription className="font-body">الإيرادات الشهرية المحققة خلال الـ 6 أشهر الماضية.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] sm:h-[350px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart data={monthlyRevenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickFormatter={(value) => `${value/1000} ألف`} tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* User Growth */}
          <Card className="shadow-lg rounded-xl border-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center"><Users className="ml-2 h-6 w-6 text-primary"/>نمو المستخدمين</CardTitle>
              <CardDescription className="font-body">عدد المستخدمين الجدد المسجلين شهريًا.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] sm:h-[350px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <LineChart data={userGrowthData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8}/>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Line type="monotone" dataKey="users" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{r: 4, fill: "hsl(var(--chart-1))", stroke: "hsl(var(--background))"}}/>
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Booking Categories Distribution */}
            <Card className="shadow-lg rounded-xl border-primary/10">
                <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center"><Activity className="ml-2 h-5 w-5 text-primary"/>توزيع الحجوزات حسب الفئة</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px] flex items-center justify-center">
                    <ChartContainer config={{}} className="w-full max-w-xs aspect-square">
                        <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="category" hideLabel />} />
                        <Pie data={bookingCategoryData} dataKey="bookings" nameKey="category" cx="50%" cy="50%" outerRadius={100} innerRadius={60}>
                             <LabelList
                                dataKey="category"
                                className="fill-background dark:fill-foreground text-xs"
                                stroke="none"
                                fontSize={10}
                                formatter={(value: string) => chartConfig[value.toLowerCase() as keyof typeof chartConfig]?.label || value}
                            />
                        </Pie>
                        <ChartLegend content={<ChartLegendContent nameKey="category" className="text-xs"/>} />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Booking Status Distribution */}
            <Card className="shadow-lg rounded-xl border-primary/10">
                <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center"><Percent className="ml-2 h-5 w-5 text-primary"/>توزيع الحجوزات حسب الحالة</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px] flex items-center justify-center">
                     <ChartContainer config={{}} className="w-full max-w-xs aspect-square">
                        <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
                        <Pie data={bookingStatusData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} labelLine={false}>
                            {bookingStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                             <LabelList
                                dataKey="status"
                                className="fill-background dark:fill-foreground text-xs"
                                stroke="none"
                                fontSize={10}
                                position="inside"
                                formatter={(value: string) => `${value} (${bookingStatusData.find(d=>d.status===value)?.count})`}
                            />
                        </Pie>
                         <ChartLegend content={<ChartLegendContent nameKey="status" className="text-xs"/>} />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>

             {/* User City Distribution */}
            <Card className="shadow-lg rounded-xl border-primary/10">
                <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center"><MapPin className="ml-2 h-5 w-5 text-primary"/>توزيع المستخدمين حسب المدينة</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px] flex items-center justify-center">
                     <ChartContainer config={{}} className="w-full max-w-xs aspect-square">
                        <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="city" hideLabel />} />
                        <Pie data={userCityData} dataKey="users" nameKey="city" cx="50%" cy="50%" outerRadius={100} innerRadius={30}  labelLine={false} >
                            {userCityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                            <LabelList
                                dataKey="city"
                                className="fill-foreground text-xs"
                                stroke="none"
                                fontSize={10}
                                position="outside"
                                offset={10}
                                formatter={(value: string) => `${value} (${userCityData.find(d=>d.city===value)?.users})`}
                            />
                        </Pie>
                         <ChartLegend content={<ChartLegendContent nameKey="city" className="text-xs"/>} />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
        

        {/* Top Performing Experiences */}
        <Card className="shadow-lg rounded-xl border-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center"><Star className="ml-2 h-6 w-6 text-primary"/>التجارب الأكثر رواجاً</CardTitle>
            <CardDescription className="font-body">قائمة بالتجارب الأعلى من حيث الحجوزات والإيرادات.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-body">اسم التجربة</TableHead>
                    <TableHead className="text-center font-body">عدد الحجوزات</TableHead>
                    <TableHead className="text-center font-body">الإيرادات (ر.س)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topExperiencesData.map((exp) => (
                    <TableRow key={exp.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium font-body py-3 pr-3">{exp.title}</TableCell>
                      <TableCell className="text-center font-body py-3">{exp.bookings.toLocaleString('ar-SA')}</TableCell>
                      <TableCell className="text-center font-body py-3">{exp.revenue.toLocaleString('ar-SA')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </main>
      <footer className="py-8 border-t bg-card mt-12">
        <div className="container text-center text-sm text-muted-foreground font-body">
          © {new Date().getFullYear()} YallaNro7. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}

