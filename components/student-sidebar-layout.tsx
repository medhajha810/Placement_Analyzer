"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Target,
  Trophy,
  Briefcase,
  Search,
  Brain,
  Bell,
  BarChart3,
  Building2,
  Mic,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Moon,
  Sun,
  User,
  MessageSquare
} from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { name: "Readiness Score", href: "/student/readiness", icon: Target, badge: "NEW" },
  { name: "Gamification", href: "/student/gamification", icon: Trophy, badge: "⭐" },
  { name: "Interactive Games", href: "/student/games", icon: Gamepad2, badge: "🎮" },
  { name: "Job Listings", href: "/student/jobs", icon: Briefcase },
  { name: "Scraped Jobs", href: "/student/scraped-jobs", icon: Search, badge: "NEW" },
  { name: "Interview Intelligence", href: "/student/interview-prep", icon: Brain, badge: "🔥" },
  { name: "Mock Interviews", href: "/student/mock-interviews", icon: Mic },
  { name: "Notifications", href: "/student/notifications", icon: Bell },
  { name: "Analytics", href: "/student/analytics", icon: BarChart3 },
  { name: "Dream Companies", href: "/student/dream-companies", icon: Building2 },
  { name: "Contact Us", href: "/contact", icon: MessageSquare },
];

export default function StudentSidebarLayout({ children }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Get user data from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <aside
          className={`${
            collapsed ? "w-20" : "w-64"
          } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 relative`}
        >
          {/* Logo & Toggle */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
            {!collapsed && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                PlacementHub
              </h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage 
                  src={userData?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.email || 'default'}`} 
                  alt={userData?.full_name || 'User'}
                />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                  {userData?.full_name ? 
                    userData.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() :
                    userData?.name ? 
                    userData.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() :
                    'U'
                  }
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {userData?.full_name || userData?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {userData?.branch || "CS"} • {userData?.graduation_year || "2026"}
                  </p>
                </div>
              )}
            </div>
            {!collapsed && (
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  PRS: 72
                </Badge>
                <Badge className="text-xs bg-green-500">
                  Top 35%
                </Badge>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                    }`}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 font-medium">{item.name}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                  {collapsed && item.badge && (
                    <div className="absolute left-14 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      !
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
              {!collapsed && <span>{theme === "light" ? "Dark" : "Light"} Mode</span>}
            </Button>
            
            <Link href="/student/profile">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <User className="w-5 h-5" />
                {!collapsed && <span>Profile</span>}
              </Button>
            </Link>

            <Link href="/student/settings">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Settings className="w-5 h-5" />
                {!collapsed && <span>Settings</span>}
              </Button>
            </Link>

            <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
              <LogOut className="w-5 h-5" />
              {!collapsed && <span>Logout</span>}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Top Bar */}
          <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Welcome back! Here's your overview
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="w-4 h-4" />
                <Badge variant="destructive" className="text-xs">3</Badge>
              </Button>
              
              <Button
                size="sm"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Complete Profile
              </Button>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
