"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Briefcase, 
  Bell, 
  TrendingUp, 
  Target, 
  GraduationCap,
  LogOut,
  Menu,
  Sparkles,
  Award,
  Brain,
  Trophy
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

export default function StudentNav() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    router.push("/login");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/student/dashboard" },
    { icon: Award, label: "Readiness Score", href: "/student/readiness", badge: "NEW" },
    { icon: Trophy, label: "Gamification", href: "/student/gamification", badge: "⭐" },
    { icon: Briefcase, label: "Job Listings", href: "/student/jobs" },
    { icon: Sparkles, label: "Scraped Jobs", href: "/student/scraped-jobs", badge: "NEW" },
    { icon: Brain, label: "Interview Intelligence", href: "/student/interview-intelligence", badge: "🔥" },
    { icon: Bell, label: "Notifications", href: "/student/notifications" },
    { icon: TrendingUp, label: "Analytics", href: "/student/analytics" },
    { icon: Target, label: "Dream Companies", href: "/student/dream-companies" },
    { icon: GraduationCap, label: "Mock Interviews", href: "/student/mock-interviews" },
  ];

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">PathFinder</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 mx-auto">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="gap-2 relative"
              onClick={() => router.push(item.href)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[9px] font-bold px-1 rounded">
                  {item.badge}
                </span>
              )}
            </Button>
          ))}
        </nav>

        {/* User Info */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {user?.fullName || "Student"}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="justify-start gap-2 relative"
                  onClick={() => router.push(item.href)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
