"use client";

import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Filter, Edit, Trash2, MoreVertical, ShieldCheck, UserCog, UserCheck, UserX } from "lucide-react";
import type { User } from "@/models";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Label } from "@/components/ui/label";

const mockUsers: User[] = [
  { uid: 'user1', email: 'client1@example.com', displayName: 'عميل سعيد', photoUrl: 'https://placehold.co/40x40.png?text=CS', role: 'client', phoneNumber: '0501234567' },
  { uid: 'user2', email: 'host.pro@example.com', displayName: 'مضيف محترف', photoUrl: 'https://placehold.co/40x40.png?text=HP', role: 'host', bio: 'مضيف خبير يقدم تجارب رائعة.' },
  { uid: 'user3', email: 'admin@yallanro7.com', displayName: 'مدير المنصة', photoUrl: 'https://placehold.co/40x40.png?text=AD', role: 'admin' },
  { uid: 'user4', email: 'new.client@example.com', displayName: 'عميل جديد', role: 'client' },
  { uid: 'user5', email: 'another.host@example.com', displayName: 'مضيف آخر', role: 'host', phoneNumber: '0559876543' },
];

const roleTextMap = {
  client: "عميل",
  host: "مضيف",
  admin: "مسؤول",
};

export default function ManageUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<User['role'] | "all">("all");
  const { toast } = useToast();

  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter]);

  const handleUserAction = (action: string, userName: string) => {
    toast({ title: `تم ${action} للمستخدم ${userName}`, description: "تم تنفيذ الإجراء بنجاح (محاكاة)." });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-headline text-primary">إدارة المستخدمين</h1>
           <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent">
                <Link href="/admin/users/new">
                    <UserCog className="ml-2 h-5 w-5" /> إضافة مستخدم جديد
                </Link>
            </Button>
        </div>

        <div className="mb-6 p-4 bg-card rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="relative">
              <Label htmlFor="search-users" className="sr-only">بحث عن مستخدمين</Label>
              <Input
                id="search-users"
                type="text"
                placeholder="بحث بالاسم أو البريد الإلكتروني..."
                className="h-11 pl-10 text-base bg-input focus:bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <div>
            <Label htmlFor="role-filter" className="sr-only">فلترة حسب الدور</Label>
              <Select dir="rtl" onValueChange={(value) => setRoleFilter(value as User['role'] | "all")} defaultValue="all">
                <SelectTrigger id="role-filter" className="h-11 text-base bg-input focus:bg-background">
                  <Filter className="ml-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="فلترة حسب الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-body">جميع الأدوار</SelectItem>
                  <SelectItem value="client" className="font-body">عميل</SelectItem>
                  <SelectItem value="host" className="font-body">مضيف</SelectItem>
                  <SelectItem value="admin" className="font-body">مسؤول</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[80px] text-center font-body">الصورة</TableHead>
                <TableHead className="font-body">الاسم</TableHead>
                <TableHead className="hidden md:table-cell font-body">البريد الإلكتروني</TableHead>
                <TableHead className="text-center font-body">الدور</TableHead>
                <TableHead className="text-center font-body">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? filteredUsers.map(user => (
                <TableRow key={user.uid} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="p-2 text-center">
                    <Avatar className="h-10 w-10 mx-auto border">
                      <AvatarImage src={user.photoUrl} alt={user.displayName} />
                      <AvatarFallback className="font-headline">{user.displayName.slice(0,2)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium font-body py-3 pr-3">{user.displayName}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground font-body py-3">{user.email}</TableCell>
                  <TableCell className="text-center font-body py-3">
                    <Badge variant={user.role === 'admin' ? 'default' : user.role === 'host' ? 'secondary' : 'outline'} className="text-xs">
                      {roleTextMap[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-body py-3">
                    <DropdownMenu dir="rtl">
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                           <span className="sr-only">إجراءات المستخدم</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="font-body">
                        <DropdownMenuLabel>إجراءات سريعة</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => handleUserAction("تعديل الدور", user.displayName)}>
                            <UserCog className="ml-2 h-4 w-4 text-blue-500"/> تعديل الدور
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleUserAction("تفعيل الحساب", user.displayName)}>
                            <UserCheck className="ml-2 h-4 w-4 text-green-500"/> تفعيل الحساب
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleUserAction("تعطيل الحساب", user.displayName)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <UserX className="ml-2 h-4 w-4"/> تعطيل الحساب
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                         <DropdownMenuItem onSelect={() => handleUserAction("حذف", user.displayName)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <Trash2 className="ml-2 h-4 w-4"/> حذف المستخدم
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground font-body">
                    لا يوجد مستخدمون يطابقون معايير البحث أو الفلترة.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {filteredUsers.length > 10 && ( /* Basic pagination placeholder */
            <div className="mt-6 flex justify-center">
                <Button variant="outline">تحميل المزيد</Button>
            </div>
        )}
      </main>
      <footer className="py-8 border-t bg-card mt-12">
        <div className="container text-center text-sm text-muted-foreground font-body">
          © {new Date().getFullYear()} YallaNro7. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
