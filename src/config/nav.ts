import type { UserRole } from "@/models";
import {
  LayoutDashboard,
  Users,
  Layers,
  BarChart3,
  Settings,
  Tag,
  PlusCircle,
  ListChecks,
  BookOpen,
  UserCircle,
  Bell,
  Shield,
  MessageSquare,
  Home
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  label?: string;
  description?: string; // For main navigation cards on dashboards
  external?: boolean;
  disabled?: boolean;
  roles: UserRole[]; // Roles that can see this link
  isHeader?: boolean; // To mark section headers
  isPrimaryAction?: boolean; // For special styling like "Add Experience"
}

export const sidebarNavItems: NavItem[] = [
  // --- General ---
  { title: "القائمة الرئيسية", href: "", icon: Home, roles: ["client", "host", "admin"], isHeader: true },
  { title: "الصفحة الرئيسية", href: "/", icon: Home, roles: ["client", "host", "admin"] },
  { title: "الإشعارات", href: "/notifications", icon: Bell, roles: ["client", "host", "admin"], label: "unread" }, // Label can be dynamic

  // --- Client Role ---
  { title: "حجوزاتي", href: "/my-bookings", icon: ListChecks, roles: ["client"] },
  { title: "الرسائل", href: "/chat/user1", icon: MessageSquare, roles: ["client"] }, // Example, dynamic chatId

  // --- Host Role ---
  { title: "لوحة تحكم المضيف", href: "", icon: LayoutDashboard, roles: ["host"], isHeader: true },
  { title: "نظرة عامة", href: "/host/dashboard", icon: LayoutDashboard, roles: ["host"] },
  { title: "تجاربي", href: "/host/listings", icon: Layers, roles: ["host"] },
  { title: "إضافة تجربة", href: "/host/experiences/new", icon: PlusCircle, roles: ["host"], isPrimaryAction: true },
  { title: "إدارة الحجوزات", href: "/host/bookings", icon: BookOpen, roles: ["host"] },
  { title: "الرسائل", href: "/host/chat/hostUserY", icon: MessageSquare, roles: ["host"] }, // Example, dynamic chatId

  // --- Admin Role ---
  { title: "لوحة تحكم المسؤول", href: "", icon: Shield, roles: ["admin"], isHeader: true },
  { title: "نظرة عامة", href: "/admin/dashboard", icon: LayoutDashboard, roles: ["admin"] },
  { title: "إدارة المستخدمين", href: "/admin/users", icon: Users, roles: ["admin"] },
  { title: "إدارة التجارب", href: "/admin/experiences", icon: Layers, roles: ["admin"] },
  { title: "الفئات والمدن", href: "/admin/categories-cities", icon: Tag, roles: ["admin"] },
  { title: "التقارير", href: "/admin/reports", icon: BarChart3, roles: ["admin"] },
  { title: "إعدادات المنصة", href: "/admin/settings", icon: Settings, roles: ["admin"] },
  
  // --- Account Section ---
  { title: "الحساب", href: "", icon: UserCircle, roles: ["client", "host", "admin"], isHeader: true },
  { title: "الملف الشخصي", href: "/profile", icon: UserCircle, roles: ["client", "host", "admin"] },
  // Logout is handled by a separate button in SidebarContent/AppHeader
];

export const dashboardNavigationCards: NavItem[] = [
    { title: "إدارة المستخدمين", href: "/admin/users", icon: Users, roles: ["admin"], description: "عرض، تعديل، وحذف المستخدمين." },
    { title: "إدارة التجارب", href: "/admin/experiences", icon: Layers, roles: ["admin"], description: "مراجعة، تفعيل، وتعطيل التجارب." },
    { title: "إدارة الفئات والمدن", href: "/admin/categories-cities", icon: Tag, roles: ["admin"], description: "إضافة وتعديل الفئات والمدن المتاحة." },
    { title: "التقارير والإحصائيات", href: "/admin/reports", icon: BarChart3, roles: ["admin"], description: "عرض تقارير مفصلة عن أداء المنصة." },
    { title: "إعدادات المنصة", href: "/admin/settings", icon: Settings, roles: ["admin"], description: "تكوين الإعدادات العامة للمنصة." },
];


export const hostDashboardCards: NavItem[] = [
    { title: "إدارة تجاربي", href: "/host/listings", icon: Layers, roles: ["host"], description: "عرض وتعديل وحذف التجارب التي قمت بإنشائها." },
    { title: "إدارة الحجوزات", href: "/host/bookings", icon: BookOpen, roles: ["host"], description: "مراجعة وتأكيد أو رفض الحجوزات الواردة من العملاء." },
    { title: "إضافة تجربة جديدة", href: "/host/experiences/new", icon: PlusCircle, roles: ["host"], description: "شارك شغفك وأنشئ تجربة فريدة لضيوفك." },
];

// Utility function to get nav items for a specific role
export const getNavItemsForRole = (role: UserRole | null): NavItem[] => {
  if (!role) return sidebarNavItems.filter(item => item.roles.includes('client')); // Default to client or public view
  return sidebarNavItems.filter(item => item.roles.includes(role));
};
