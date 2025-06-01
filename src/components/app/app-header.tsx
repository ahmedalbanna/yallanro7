
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, LogIn, LogOut, UserCircle, LayoutDashboard, PlusCircle, Menu, Layers, BookOpen, Users, Shield, UserCog } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import React from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock user data and auth status - made mutable for logout/role switch simulation
let isAuthenticatedMock = true; 
let userRoleMock: 'client' | 'host' | 'admin' | null = 'client'; 
let currentUserNameMock = "اسم المستخدم";
let currentUserPhotoUrlMock = "https://placehold.co/40x40.png";


const AppLogo = () => (
  <Link href="/" className="flex items-center gap-2" aria-label="YallaNro7 Home">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
      <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path>
    </svg>
    <span className="text-2xl font-headline font-bold text-primary">YallaNro7</span>
  </Link>
);

const NavLinks: React.FC<{ isMobile?: boolean; onLinkClick?: () => void, onLogout: () => void, onSwitchRole: (role: 'client' | 'host' | 'admin') => void }> = ({ isMobile, onLinkClick, onLogout, onSwitchRole }) => {
  const currentUser = isAuthenticatedMock ? { displayName: currentUserNameMock, photoUrl: currentUserPhotoUrlMock, role: userRoleMock } : null;

  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick();
  };
  
  return (
    <>
      {currentUser?.role === 'host' && (
        <Button asChild variant={isMobile ? "default" : "default"} size={isMobile ? "lg" : "sm"} className={isMobile ? "w-full justify-center" : ""} onClick={handleLinkClick}>
          <Link href="/host/experiences/new">
            <PlusCircle className="ml-2 h-4 w-4" />
            إضافة تجربة
          </Link>
        </Button>
      )}
      {isMobile && currentUser && (
        <>
          <div className="flex flex-col space-y-1">
            <div className="my-1 border-t border-border -mx-2"></div>
            <div className="px-2 py-1.5 text-sm font-semibold font-body text-foreground/70">القائمة</div>

            <Button asChild variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm h-auto font-body" onClick={handleLinkClick}>
              <Link href="/profile">
                <UserCircle className="ml-2 h-4 w-4" />
                <span>الملف الشخصي</span>
              </Link>
            </Button>

            {currentUser.role === 'client' && (
              <Button asChild variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm h-auto font-body" onClick={handleLinkClick}>
                  <Link href="/my-bookings">
                  <LayoutDashboard className="ml-2 h-4 w-4" />
                  <span>حجوزاتي</span>
                </Link>
              </Button>
            )}
            {currentUser.role === 'host' && (
              <>
                <Button asChild variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm h-auto font-body" onClick={handleLinkClick}>
                  <Link href="/host/dashboard">
                    <LayoutDashboard className="ml-2 h-4 w-4" />
                    <span>لوحة التحكم</span>
                  </Link>
                </Button>
                  <Button asChild variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm h-auto font-body" onClick={handleLinkClick}>
                  <Link href="/host/listings">
                    <Layers className="ml-2 h-4 w-4" />
                    <span>تجاربي</span>
                  </Link>
                </Button>
                  <Button asChild variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm h-auto font-body" onClick={handleLinkClick}>
                  <Link href="/host/bookings">
                    <BookOpen className="ml-2 h-4 w-4" />
                    <span>إدارة الحجوزات</span>
                  </Link>
                </Button>
              </>
            )}
            {currentUser.role === 'admin' && (
                <Button asChild variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm h-auto font-body" onClick={handleLinkClick}>
                  <Link href="/admin/dashboard">
                    <LayoutDashboard className="ml-2 h-4 w-4" />
                    <span>لوحة التحكم</span>
                  </Link>
                </Button>
            )}
          </div>
          <div className="my-1 border-t border-border -mx-2"></div>
           <div className="px-2 py-1.5 text-sm font-semibold font-body text-foreground/70">تبديل الدور (تجريبي)</div>
            <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm h-auto font-body" onClick={() => { onSwitchRole('client'); handleLinkClick(); }}>
                <UserCircle className="ml-2 h-4 w-4" /> تصفح كـ عميل
            </Button>
            <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm h-auto font-body" onClick={() => { onSwitchRole('host'); handleLinkClick(); }}>
                <Users className="ml-2 h-4 w-4" /> تصفح كـ مضيف
            </Button>
            <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm h-auto font-body" onClick={() => { onSwitchRole('admin'); handleLinkClick(); }}>
                <Shield className="ml-2 h-4 w-4" /> تصفح كـ مسؤول
            </Button>
           <div className="my-1 border-t border-border -mx-2"></div>
           <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm h-auto font-body text-destructive hover:text-destructive/80" onClick={() => { onLogout(); handleLinkClick(); }}> 
            <LogOut className="ml-2 h-4 w-4" />
            <span>تسجيل الخروج</span>
          </Button>
        </>
      )}
    </>
  );
};


export function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [_, forceUpdate] = React.useState(0); // Dummy state for re-render
  const { toast } = useToast();

  const currentUser = isAuthenticatedMock ? { displayName: currentUserNameMock, photoUrl: currentUserPhotoUrlMock, role: userRoleMock } : null;

  const handleLogout = () => {
    isAuthenticatedMock = false;
    userRoleMock = null;
    currentUserNameMock = "";
    currentUserPhotoUrlMock = "";
    forceUpdate(prev => prev + 1); 
    setMobileMenuOpen(false); 
    toast({
      title: "تم تسجيل الخروج",
      description: "نأمل أن نراك قريباً!",
    });
  };

  const handleSwitchRole = (newRole: 'client' | 'host' | 'admin') => {
    userRoleMock = newRole;
    isAuthenticatedMock = true; // Ensure user stays authenticated
    switch (newRole) {
      case 'client':
        currentUserNameMock = "عميل تجريبي";
        currentUserPhotoUrlMock = "https://placehold.co/40x40.png?text=CL";
        break;
      case 'host':
        currentUserNameMock = "مضيف تجريبي";
        currentUserPhotoUrlMock = "https://placehold.co/40x40.png?text=HO";
        break;
      case 'admin':
        currentUserNameMock = "مسؤول تجريبي";
        currentUserPhotoUrlMock = "https://placehold.co/40x40.png?text=AD";
        break;
    }
    forceUpdate(prev => prev + 1);
    setMobileMenuOpen(false); // Close mobile menu on role switch
    toast({
      title: "تم تبديل الدور",
      description: `أنت الآن تتصفح كـ ${newRole === 'client' ? 'عميل' : newRole === 'host' ? 'مضيف' : 'مسؤول'}.`,
    });
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <AppLogo />
        
        <div className="hidden md:flex flex-1 max-w-xs items-center gap-2 ml-auto mr-4">
         {/* Desktop search can be added here if needed globally, or kept page-specific */}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <NavLinks onLogout={handleLogout} onSwitchRole={handleSwitchRole} />
          {currentUser && (
            <>
             {/* Role Switcher Dropdown - for prototyping */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="font-body">
                    <UserCog className="ml-2 h-4 w-4" /> تبديل الدور
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 font-body" align="end">
                  <DropdownMenuLabel>اختر دورًا للتصفح</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSwitchRole('client')}>
                    <UserCircle className="ml-2 h-4 w-4" /> تصفح كـ عميل
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSwitchRole('host')}>
                    <Users className="ml-2 h-4 w-4" /> تصفح كـ مضيف
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSwitchRole('admin')}>
                    <Shield className="ml-2 h-4 w-4" /> تصفح كـ مسؤول
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                 <span className="sr-only">الإشعارات</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={currentUser.photoUrl} alt={currentUser.displayName} />
                      <AvatarFallback className="font-headline">{currentUser.displayName?.slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                     <span className="sr-only">قائمة المستخدم</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 font-body" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{currentUser.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.role === 'client' && 'عميل'}
                        {currentUser.role === 'host' && 'مضيف'}
                        {currentUser.role === 'admin' && 'مسؤول'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <UserCircle className="ml-2 h-4 w-4" />
                      <span>الملف الشخصي</span>
                    </Link>
                  </DropdownMenuItem>
                  {currentUser.role === 'client' && (
                    <DropdownMenuItem asChild>
                       <Link href="/my-bookings">
                        <LayoutDashboard className="ml-2 h-4 w-4" />
                        <span>حجوزاتي</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {currentUser.role === 'host' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/host/dashboard">
                          <LayoutDashboard className="ml-2 h-4 w-4" />
                          <span>لوحة التحكم</span>
                        </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                        <Link href="/host/listings">
                          <Layers className="ml-2 h-4 w-4" />
                          <span>تجاربي</span>
                        </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                        <Link href="/host/bookings">
                          <BookOpen className="ml-2 h-4 w-4" />
                          <span>إدارة الحجوزات</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {currentUser.role === 'admin' && (
                     <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard">
                          <LayoutDashboard className="ml-2 h-4 w-4" />
                          <span>لوحة التحكم</span>
                        </Link>
                      </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="ml-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          {!currentUser && (
            <Button asChild size="sm">
              <Link href="/auth">
                <LogIn className="ml-2 h-4 w-4" />
                تسجيل الدخول
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          {currentUser && (
            <Button variant="ghost" size="icon" aria-label="Notifications" className="mr-2">
              <Bell className="h-5 w-5" />
              <span className="sr-only">الإشعارات</span>
            </Button>
          )}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">فتح القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs p-6 font-body">
               <SheetHeader className="mb-4">
                 <AppLogo />
                 <SheetTitle className="sr-only">القائمة الرئيسية</SheetTitle>
              </SheetHeader>
              <div className="space-y-2">
                <NavLinks isMobile onLinkClick={() => setMobileMenuOpen(false)} onLogout={handleLogout} onSwitchRole={handleSwitchRole}/>
                {!currentUser && (
                  <Button asChild size="lg" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Link href="/auth">
                      <LogIn className="ml-2 h-4 w-4" />
                      تسجيل الدخول
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}

